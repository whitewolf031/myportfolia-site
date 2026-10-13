from rest_framework.throttling import SimpleRateThrottle

class ContactRateThrottle(SimpleRateThrottle):
    scope = "contact_ip"

    def get_cache_key(self, request, view):
        if request.user and request.user.is_authenticated and request.user.is_staff:
            return None
        return self.get_ident(request)
