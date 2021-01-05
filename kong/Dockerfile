FROM kong:latest


# Copy Plugins to directory where kong expects plugin rocks
COPY ./plugins/ /usr/local/custom/kong/plugins/

# Copy scripts to starting location
COPY ./scripts/ .

USER root

RUN ["chmod", "+x", "./plugin_setup.sh"]
RUN [ "./plugin_setup.sh"]

RUN ["chmod", "+x", "./docker-entrypoint.sh"]
ENTRYPOINT [ "./docker-entrypoint.sh"]

STOPSIGNAL SIGQUIT

CMD ["kong", "docker-start"]
