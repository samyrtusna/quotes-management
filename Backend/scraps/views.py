from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.response import Response
from authentication.permissions import UserPermission
from .models import Scraps
from .serializers import ScrapsSerializer, CreateScrapsSerializer
from rawProducts.models.raw_products import RawProduct


class ScrapsViewset(viewsets.ModelViewSet):
    
    permission_classes = (UserPermission,)

    def get_queryset(self): 
        if self.request.user.is_superuser:
            return Scraps.objects.all()
        return Scraps.objects.filter(owner=self.request.user)
    
    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return CreateScrapsSerializer
        return ScrapsSerializer

    def scraps_list(self, item_bars, scraps, bar):
        while len(item_bars) > 0:
            min_item = min(item_bars)
            if min_item > bar:
                scraps.append(bar)
                bar = 6000
            else:
                max_item = max([item for item in item_bars if item <= bar])
                bar -= max_item
                item_bars.remove(max_item)
        scraps.append(bar)
        return scraps

    @action(detail=False, methods=["POST"])
    def calculate_scraps_bars(self, request):
        data = self.request.data
        height = (float(data["height"])) * 1000
        width = (float(data["width"])) * 1000
        quantity = int(data["quantity"])
        product_code = data["code"]
        volet_roulant = data.get("volet_roulant", False)
        product_scraps = []

        if product_code == 101:
            cadre = RawProduct.objects.get(code=103)
            ouvrant = RawProduct.objects.get(code=105)
            parclose = RawProduct.objects.get(code=514)

            cadre_bars = [height, width] * 2 * quantity
            scraps = []

            bar = 6000
            self.scraps_list(cadre_bars, scraps, bar)

            cadre_scraps = list(map(lambda x: {"code": cadre.code, "label": cadre.label, "length": x/1000, "mesure": cadre.mesure}, scraps))

            ouvrant_bars = [height, width] * 2 * quantity
            scraps = []
            bar = 6000
            self.scraps_list(ouvrant_bars, scraps, bar)
            ouvrant_scraps = list(map(lambda x: {"code": ouvrant.code, "label": ouvrant.label, "length": x/1000, "mesure": ouvrant.mesure}, scraps))

            parclose_bars = [height, width] * 2 * quantity
            scraps = []
            bar = 6000
            self.scraps_list(parclose_bars, scraps, bar)
            parclose_scraps = list(map(lambda x: {"code": parclose.code, "label": parclose.label, "length": x/1000, "mesure": parclose.mesure}, scraps))

            product_scraps = cadre_scraps + ouvrant_scraps + parclose_scraps

        if product_code in [102, 103]:
            cadre = RawProduct.objects.get(code=103)
            ouvrant = RawProduct.objects.get(code=105)
            traverse = RawProduct.objects.get(code=107)
            parclose = RawProduct.objects.get(code=514)

            cadre_bars = [height, width] * 2 * quantity
            scraps = []

            bar = 6000
            self.scraps_list(cadre_bars, scraps, bar)

            cadre_scraps = list(map(lambda x: {"code": cadre.code, "label": cadre.label, "length": x/1000, "mesure": cadre.mesure}, scraps))

            ouvrant_bars = [height, width] * 2 * quantity
            scraps = []
            bar = 6000
            self.scraps_list(ouvrant_bars, scraps, bar)
            ouvrant_scraps = list(map(lambda x: {"code": ouvrant.code, "label": ouvrant.label, "length": x/1000, "mesure": ouvrant.mesure}, scraps))

            traverse_bars = [width] * quantity
            scraps = []
            bar = 6000
            self.scraps_list(traverse_bars, scraps, bar)
            traverse_scraps = list(map(lambda x: {"code": traverse.code, "label": traverse.label, "length": x/1000, "mesure": traverse.mesure}, scraps))

            parclose_bars = [height, width] * 2 * quantity
            scraps = []
            bar = 6000
            self.scraps_list(parclose_bars, scraps, bar)
            parclose_scraps = list(map(lambda x: {"code": parclose.code, "label": parclose.label, "length": x/1000, "mesure": parclose.mesure}, scraps))

            product_scraps = cadre_scraps + ouvrant_scraps + traverse_scraps + parclose_scraps

        if product_code == 201:
            cadre = RawProduct.objects.get(code=225)
            ouvrant = RawProduct.objects.get(code=206)
            parclose = RawProduct.objects.get(code=214)
            chicane = RawProduct.objects.get(code=216)
            rail = RawProduct.objects.get(code=217)

            cadre_bars = [height, width] * 2 * quantity
            scraps = []
            bar = 6000
            self.scraps_list(cadre_bars, scraps, bar)
            cadre_scraps = list(map(lambda x: {"code": cadre.code, "label": cadre.label, "length": x/1000, "mesure": cadre.mesure}, scraps))

            ouvrant_bars = [height, width / 2] * 4 * quantity
            scraps = []
            bar = 6000
            self.scraps_list(ouvrant_bars, scraps, bar)
            ouvrant_scraps = list(map(lambda x: {"code": ouvrant.code, "label": ouvrant.label, "length": x/1000, "mesure": ouvrant.mesure}, scraps))

            parclose_bars = [height, width / 2] * 4 * quantity
            scraps = []
            bar = 6000
            self.scraps_list(parclose_bars, scraps, bar)
            parclose_scraps = list(map(lambda x: {"code": parclose.code, "label": parclose.label, "length": x/1000, "mesure": parclose.mesure}, scraps))

            chicane_bars = [height] * 2 * quantity
            scraps = []
            bar = 6000
            self.scraps_list(chicane_bars, scraps, bar)
            chicane_scraps = list(map(lambda x: {"code": chicane.code, "label": chicane.label, "length": x/1000, "mesure": chicane.mesure}, scraps))

            rail_bars = [width] * 2 * quantity
            scraps = []
            bar = 6000
            self.scraps_list(rail_bars, scraps, bar)
            rail_scraps = list(map(lambda x: {"code": rail.code, "label": rail.label, "length": x/1000, "mesure": rail.mesure}, scraps))

            product_scraps = cadre_scraps + ouvrant_scraps + parclose_scraps + chicane_scraps + rail_scraps

        if product_code == 202:
            cadre = RawProduct.objects.get(code=103)
            ouvrant = RawProduct.objects.get(code=104)
            parclose = RawProduct.objects.get(code=514)

            cadre_bars = [height, width] * 2 * quantity
            scraps = []
            bar = 6000
            self.scraps_list(cadre_bars, scraps, bar)
            cadre_scraps = list(map(lambda x: {"code": cadre.code, "label": cadre.label, "length": x/1000, "mesure": cadre.mesure}, scraps))

            ouvrant_bars = [height, width / 2] * 4 * quantity
            scraps = []
            bar = 6000
            self.scraps_list(ouvrant_bars, scraps, bar)
            ouvrant_scraps = list(map(lambda x: {"code": ouvrant.code, "label": ouvrant.label, "length": x/1000, "mesure": ouvrant.mesure}, scraps))

            parclose_bars = [height, width / 2] * 4 * quantity
            scraps = []
            bar = 6000
            self.scraps_list(parclose_bars, scraps, bar)
            parclose_scraps = list(map(lambda x: {"code": parclose.code, "label": parclose.label, "length": x/1000, "mesure": parclose.mesure}, scraps))

            product_scraps = cadre_scraps + ouvrant_scraps + parclose_scraps

        if volet_roulant:
            if product_code != 201:
                traverse = RawProduct.objects.get(code=107)

                traverse_bars = [width] * quantity
                scraps = []
                bar = 6000
                self.scraps_list(traverse_bars, scraps, bar)
                traverse_scraps = list(map(lambda x: {"code": traverse.code, "label": traverse.label, "length": x/1000, "mesure": traverse.mesure}, scraps))

                product_scraps.extend(traverse_scraps)

        return Response(product_scraps, status=status.HTTP_200_OK)
