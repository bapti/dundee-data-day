FROM prom/alertmanager

ADD alertmanager.conf /etc/alertmanager.conf

EXPOSE 9093

CMD        [ "-config.file=/etc/alertmanager.conf" ]