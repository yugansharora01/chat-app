from django.core.management.base import BaseCommand
from supabase import create_client
import os

class Command(BaseCommand):
    help = "Ping Supabase Auth to prevent project pause"

    def handle(self, *args, **kwargs):
        supabase = create_client(
            os.getenv("SUPABASE_URL"),
            os.getenv("SUPABASE_ANON_KEY")
        )

        email = os.getenv("SUPABASE_HEALTH_EMAIL")

        try:
            supabase.auth.sign_in_with_otp({"email": email})
            self.stdout.write(
                self.style.SUCCESS("Supabase Auth ping successful")
            )
        except Exception as e:
            self.stderr.write(
                self.style.ERROR(f"Supabase Auth ping failed: {e}")
            )
