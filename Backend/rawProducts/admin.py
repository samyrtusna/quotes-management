from django.contrib import admin
from .models.raw_products import RawProduct
from .models.raw_products_consumed import RawProductsConsumed


class RawProductAdmin(admin.ModelAdmin):

    list_display = ('label', 'code', 'price', 'mesure', 'length', 'is_deleted')

    def get_queryset(self, request):
        return RawProduct.all_objects.all()
    
    def is_deleted(self,obj):
        return obj.deleted_at is not None
    is_deleted.boolean = True
    is_deleted.short_description = 'Soft Deleted'

    def restore_products(self, request, queryset):
        for obj in queryset:
            if obj.deleted_at:
                obj.restore()
        self.message_user(request, "Selected products restored successfully.")
    
    restore_products.short_description = 'Restore selected products'

admin.site.register(RawProduct,RawProductAdmin)
admin.site.register(RawProductsConsumed)
