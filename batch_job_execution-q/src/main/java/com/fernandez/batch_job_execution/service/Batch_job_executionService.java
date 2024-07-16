
package com.fernandez.batch_job_execution.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class Batch_job_executionService {

    private static final String TOPIC = "testear-actividad-usuario";
    private static final Logger logger = LoggerFactory.getLogger(Batch_job_executionService.class);

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    public void sendMessage(String key, String message) {
        kafkaTemplate.send(TOPIC, key, message).addCallback(
                result -> logger.info("Mensaje enviado: " + message + " con offset: " + result.getRecordMetadata().offset()),
                ex -> logger.error("Error enviando mensaje: " + message, ex)
        );
    }
}
