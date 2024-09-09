from django.contrib import admin
from .models.quote import Quote
from .models.quoteDetails import QuoteDetails

admin.site.register(Quote)
admin.site.register(QuoteDetails)
