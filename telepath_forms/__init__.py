"""
Register Telepath adapters for core Django form widgets, so that they can
have corresponding Javascript objects with the ability to render new instances
and extract field values.
"""

from django import forms
from django.core.exceptions import ValidationError
from django.forms.utils import pretty_name

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
            "telepath_forms/js/telepath-forms.js",
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


class FieldAdapter(Adapter):
    js_constructor = "telepath.forms.Field"

    def js_args(self, bound_field):
        return [
            {
                "label": bound_field.label,
                "help_text": bound_field.help_text,
                "required": bound_field.field.required,
                "widget": bound_field.field.widget,
            }
        ]

    class Media:
        js = [
            "telepath_forms/js/telepath-forms.js",
        ]


register(FieldAdapter(), forms.BoundField)


class FormAdapter(Adapter):
    js_constructor = "telepath.forms.Form"

    def js_args(self, form):
        return [
            {bound_field.name: bound_field for bound_field in form},
            form.prefix,
        ]

    class Media:
        js = [
            "telepath_forms/js/telepath-forms.js",
        ]


register(FormAdapter(), forms.Form)


class FormSetAdapter(Adapter):
    js_constructor = "telepath.forms.FormSet"

    def js_args(self, formset):
        return [
            formset.empty_form,
            formset.prefix,
        ]

    class Media:
        js = [
            "telepath_forms/js/telepath-forms.js",
        ]


register(FormSetAdapter(), forms.BaseFormSet)


class ValidationErrorAdapter(Adapter):
    js_constructor = "telepath.forms.ValidationError"

    def js_args(self, error):
        return [
            error.messages,
        ]

    class Media:
        js = [
            "telepath_forms/js/telepath-forms.js",
        ]


register(ValidationErrorAdapter(), ValidationError)
