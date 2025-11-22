# documents/services/document_service.py
from django.db import transaction
from chat.models import FileAttachment, Message
from documents.models import Document
from documents.utils.extraction import extract_text_from_file
from documents.utils.chunking import chunk_text
from llm.embeddings import embed
from llm.vector_store import save_chunks_for_document

@transaction.atomic
def process_file_attachment(file_attachment_id, owner_id):
    """
    Process single FileAttachment:
      - extract text
      - chunk
      - embed
      - store Document + chunks
    Returns Document instance.
    """
    fa = FileAttachment.objects.select_related("message", "message__conversation").get(pk=file_attachment_id)
    file_obj = fa.file
    # Ensure pointer at beginning
    file_obj.open()
    try:
        extracted = extract_text_from_file(file_obj)
    finally:
        file_obj.close()

    # create Document record (if not exists)
    document, created = Document.objects.get_or_create(
        file_attachment=fa,
        defaults={
            "owner_id": owner_id,
            "file_name": fa.file_name or fa.file.name,
            "extracted_text": extracted or "",
        }
    )
    if not created:
        # update extracted text if blank
        if not document.extracted_text and extracted:
            document.extracted_text = extracted
            document.save()

    chunks = chunk_text(extracted or "")
    if not chunks:
        return document

    # embed all chunks in batch
    embeddings = embed(chunks)  # returns list[list[float]]
    # Save chunks
    save_chunks_for_document(document, chunks, embeddings)
    return document
