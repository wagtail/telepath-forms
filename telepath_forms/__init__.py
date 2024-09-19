"""
Register Telepath adapters for core Django form widgets, so that they can
have corresponding Javascript objects with the ability to render new instances
and extract field values.
"""

from django import forms
from django.core.exceptions import ValidationError

from telepath import Adapter, register


class WidgetAdapter(Adapter):
    js_constructor = "telepath.forms.Widget"

    def js_args(self, widget):
        return [
            widget.render("__NAME__", None, attrs={"id": "__ID__"}),
            widget.id_for_label("__ID__"),
        ]

    def get_media(self, widget):
        media = super().get_media(widget)
        return media + widget.media

    class Media:
        js = [
            "telepath_forms/js/widgets.js",
        ]


register(WidgetAdapter(), forms.widgets.Input)
register(WidgetAdapter(), forms.Textarea)


class CheckboxInputAdapter(WidgetAdapter):
    js_constructor = "telepath.forms.CheckboxInput"


register(CheckboxInputAdapter(), forms.CheckboxInput)


class RadioSelectAdapter(WidgetAdapter):
    js_constructor = "telepath.forms.RadioSelect"


register(RadioSelectAdapter(), forms.RadioSelect)
register(RadioSelectAdapter(), forms.CheckboxSelectMultiple)


class SelectAdapter(WidgetAdapter):
    js_constructor = "telepath.forms.Select"


register(SelectAdapter(), forms.Select)


class ValidationErrorAdapter(Adapter):
    js_constructor = "telepath.forms.ValidationError"

    def js_args(self, error):
        return [
            error.messages,
        ]

    class Media:
        js = [
            "telepath_forms/js/widgets.js",
        ]


register(ValidationErrorAdapter(), ValidationError)
