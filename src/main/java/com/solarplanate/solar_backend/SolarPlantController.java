

package com.solarplanate.solar_backend;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class SolarPlantController {

    private final SolarPlantRepository repository;

    public SolarPlantController(SolarPlantRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/plants")
    public List<SolarPlant> getAllPlants() {

        return repository.findAll();
    }
}