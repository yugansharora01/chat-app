# documents/utils/extraction.py
import os
import docx
from PyPDF2 import PdfReader

def extract_text_from_file(file_obj):
    # file_obj is a Django UploadedFile (has .name and file pointer)
    ext = os.path.splitext(file_obj.name)[1].lower()
    file_obj.seek(0)
    if ext == ".pdf":
        reader = PdfReader(file_obj)
        pages = [p.extract_text() or "" for p in reader.pages]
        return "\n".join(pages)
    if ext == ".docx":
        # python-docx expects a path-like object; file_obj works
        doc = docx.Document(file_obj)
        return "\n".join([p.text for p in doc.paragraphs])
    if ext == ".txt":
        try:
            return file_obj.read().decode("utf-8", errors="ignore")
        except Exception:
            file_obj.seek(0)
            return file_obj.read().decode("utf-8", errors="ignore")
    # Fallback: try reading as text
    try:
        file_obj.seek(0)
        return file_obj.read().decode("utf-8", errors="ignore")
    except Exception:
        return ""
