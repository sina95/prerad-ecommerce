from allauth.account.adapter import DefaultAccountAdapter
from django.forms import ValidationError


class CustomProcessAdapter(DefaultAccountAdapter):

    def clean_username(self, username):
        if len(username) > 8:
            raise ValidationError(
                'Please enter a username value less than the current one')
        # For other default validations.
        return DefaultAccountAdapter.clean_username(self, username)

    def clean_email(self, email):
        RestrictedList = ['test@test.com']
        if email in RestrictedList:
            raise ValidationError(
                'You are restricted from registering. Please contact admin.')
        return email

    def clean_password(self, password):
        if len(password) > 20:
            raise ValidationError(
                'Please Enter a password greater that you can remember.')
        return DefaultAccountAdapter.clean_password(self, password)
