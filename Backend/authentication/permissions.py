from rest_framework.permissions import BasePermission, SAFE_METHODS


class UserPermission(BasePermission):


    def has_permission(self, request, view):
        if view.basename in ["product", "product-details", "product familly","raw product", "raws consumed","quote","quote-details", "logout","scraps"]:
            return bool(request.user)
        return False

    
        
        
        
