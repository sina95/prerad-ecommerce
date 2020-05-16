#!/bin/bash

NAME="home"                                   # Name of the application
DJANGODIR=/home/smadzar/prerad-ecommerce               # Django project directory
SOCKFILE=/home/smadzar/prerad-ecommerce/venv/run/gunicorn.sock  # we will communicte using this unix socket
USER=smadzar                                         # the user to run as
GROUP=smadzar                                        # the group to run as
NUM_WORKERS=3                                       # how many worker processes should Gunicorn spawn
DJANGO_SETTINGS_MODULE=home.settings.prod      # which settings file should Django use
DJANGO_WSGI_MODULE=home.wsgi.prod              # WSGI module name
echo "Starting $NAME as `whoami`"

# Activate the virtual environment

cd $DJANGODIR
source /home/smadzar/prerad-ecommerce/venv/bin/activate
export DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE
export PYTHONPATH=$DJANGODIR:$PYTHONPATH

# Create the run directory if it doesn't exist

RUNDIR=$(dirname $SOCKFILE)
test -d $RUNDIR || mkdir -p $RUNDIR

# Start your Django Unicorn
# Programs meant to be run under supervisor should not daemonize themselves (do not use --daemon)

exec /home/smadzar/prerad-ecommerce/venv/bin/gunicorn ${DJANGO_WSGI_MODULE}:application \
  --name $NAME \
  --workers $NUM_WORKERS \
  --user=$USER --group=$GROUP \
  --bind=unix:$SOCKFILE \
  --log-level=info \
  --log-file=-
