from django.db import migrations, models
from django.db.models import Count
import uuid


def generate_identifier():
    return f"KJS-{uuid.uuid4().hex[:12].upper()}"


def populate_public_identifiers(apps, schema_editor):
    EmployeeProfile = apps.get_model('employee_dashboard', 'EmployeeProfile')
    # 1) Fix duplicated non-null public_identifiers: keep one, regenerate for the rest
    duplicates = (
        EmployeeProfile.objects.values('public_identifier')
        .exclude(public_identifier__isnull=True)
        .annotate(c=Count('id'))
        .filter(c__gt=1)
    )

    for row in duplicates:
        ident = row['public_identifier']
        profiles = list(EmployeeProfile.objects.filter(public_identifier=ident).order_by('id'))
        # Keep the first, reassign new unique identifiers to the rest
        for profile in profiles[1:]:
            for _ in range(20):
                new_ident = generate_identifier()
                if not EmployeeProfile.objects.filter(public_identifier=new_ident).exists():
                    profile.public_identifier = new_ident
                    profile.save(update_fields=['public_identifier'])
                    break

    # 2) Populate missing public_identifier values ensuring uniqueness
    for profile in EmployeeProfile.objects.filter(public_identifier__isnull=True):
        for _ in range(20):
            ident = generate_identifier()
            if not EmployeeProfile.objects.filter(public_identifier=ident).exists():
                profile.public_identifier = ident
                profile.save(update_fields=['public_identifier'])
                break


class Migration(migrations.Migration):

    dependencies = [
        ('employee_dashboard', '0009_employeeprofile_public_identifier'),
    ]

    operations = [
        migrations.RunPython(populate_public_identifiers, reverse_code=migrations.RunPython.noop),
        migrations.AlterField(
            model_name='employeeprofile',
            name='public_identifier',
            field=models.CharField(default=generate_identifier, editable=False, max_length=40, unique=True),
        ),
    ]
