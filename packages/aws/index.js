"use strict";

const AWS = require("aws-sdk");
const Config = require("@inja/config");
const Logger = require("@inja/logger");

const services = { ...AWS };

Object.keys(services).forEach(key => {
  const Service = services[key];
  if (Service.__super__ === AWS.Service) {
    services[key] = {

      inject() {
        return [Config, Logger];
      },

      init(config, logger) {
        const logLevel = config.get("aws.logLevel", "info");
        return new Service({
          ...config.get('aws.config', null),
          ...config.get(`aws.${Service.serviceIdentifier}`, null),
          logger: {
            log: msg => logger.log(logLevel, msg, {
              aws: Service.serviceIdentifier
            })
          }
        });
      }

    };
  }
});

module.exports = services;
