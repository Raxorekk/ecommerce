from django.utils.text import slugify


def generate_unique_slug(name, model, current_pk):
    slug = slugify(name)
    if not slug:
        raise ValueError("Name is null")
    temp_slug = slug
    enum = 0
    # pk is only used if function is working on currently selected object 
    while model.objects.filter(slug=slug).exclude(pk=current_pk).exists():
        enum += 1
        slug = temp_slug + f"-{enum}"
    
    return slug