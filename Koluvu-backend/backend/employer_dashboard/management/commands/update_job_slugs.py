from django.core.management.base import BaseCommand
from django.utils.text import slugify
from employer_dashboard.models import Job, EmployerProfile


class Command(BaseCommand):
    help = 'Update existing jobs with URL slugs and job numbers'

    def handle(self, *args, **options):
        self.stdout.write('Updating job slugs...')
        
        # Process each employer's jobs
        employers = EmployerProfile.objects.all()
        total_updated = 0
        
        for employer in employers:
            jobs = Job.objects.filter(employer=employer).order_by('created_at')
            job_count = 0
            
            for job in jobs:
                job_count += 1
                updated = False
                
                # Update company slug
                if not job.company_slug and job.company_name:
                    job.company_slug = slugify(job.company_name)
                    updated = True
                
                # Update title slug
                if not job.title_slug and job.title:
                    job.title_slug = slugify(job.title)
                    updated = True
                
                # Update job number
                if job.job_number == 0:
                    job.job_number = job_count
                    updated = True
                
                if updated:
                    job.save()
                    total_updated += 1
                    self.stdout.write(
                        self.style.SUCCESS(
                            f'Updated: {job.get_public_url()}'
                        )
                    )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully updated {total_updated} jobs'
            )
        )
