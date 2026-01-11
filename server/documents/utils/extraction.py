# documents/utils/extraction.py
import os
import re
import docx
from PyPDF2 import PdfReader

def extract_text_from_file(file_obj):
    # file_obj is a Django UploadedFile (has .name and file pointer)
    ext = os.path.splitext(file_obj.name)[1].lower()
    file_obj.seek(0)
    if ext == ".pdf":
        reader = PdfReader(file_obj)
        pages = [p.extract_text() or "" for p in reader.pages]
        text = " ".join(pages)
        # Clean up excessive whitespace and newlines
        text = re.sub(r'\n+', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text
    if ext == ".docx":
        # python-docx expects a path-like object; file_obj works
        doc = docx.Document(file_obj)
        text = " ".join([p.text for p in doc.paragraphs])
        # Clean up excessive whitespace and newlines
        text = re.sub(r'\n+', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text
    if ext == ".txt":
        try:
            text = file_obj.read().decode("utf-8", errors="ignore")
            # Clean up excessive whitespace and newlines
            text = re.sub(r'\n+', ' ', text)
            text = re.sub(r'\s+', ' ', text).strip()
            return text
        except Exception:
            file_obj.seek(0)
            text = file_obj.read().decode("utf-8", errors="ignore")
            # Clean up excessive whitespace and newlines
            text = re.sub(r'\n+', ' ', text)
            text = re.sub(r'\s+', ' ', text).strip()
            return text
    # Fallback: try reading as text
    try:
        file_obj.seek(0)
        text = file_obj.read().decode("utf-8", errors="ignore")
        # Clean up excessive whitespace and newlines
        text = re.sub(r'\n+', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text
    except Exception:
        return ""
