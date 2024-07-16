
package com.fernandez.batch_job_execution.controller;

import com.fernandez.batch_job_execution.service.Batch_job_executionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Batch_job_executionController {

    @Autowired
    private Batch_job_executionService producerService;

    @GetMapping("/send")
    public String sendMessage(@RequestParam("clave") String clave, @RequestParam("message") String message) {
        producerService.sendMessage(clave, message);
        return "";
    }
}
