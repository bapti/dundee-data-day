FROM prom/prometheus:0.16.1

ADD prometheus.yml /etc/prometheus/prometheus.yml
ADD alert.rules /etc/prometheus/alert.rules

RUN mkdir -p /etc/prometheus/targets.d

EXPOSE 9090

ENTRYPOINT [ "/bin/prometheus" ]
CMD        [ "-config.file=/etc/prometheus/prometheus.yml", \
             "-alertmanager.url=http://192.168.99.100:9093", \
             "-storage.local.path=/prometheus", \
             "-web.console.libraries=/etc/prometheus/console_libraries", \
             "-web.console.templates=/etc/prometheus/consoles", \
             "-web.listen-address=:9090" ]
