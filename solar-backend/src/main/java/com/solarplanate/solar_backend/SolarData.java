package com.solarplanate.solar_backend;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "solar_data")
public class SolarData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double voltage;

    private double current;

    private double power;

    private double temperature;

    @Column(name = "energy_today")
    private double energyToday;

    private String status;

    @Column(name = "plant_name")
    private String plantName;

    private String location;

    private double capacity;

    @Column(name = "total_panels")
    private int totalPanels;

    // IMPORTANT:
    // Integer is used because old database records
    // may contain NULL plant_id values.
    private Integer plantId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;


    // =====================================
    // Constructor
    // =====================================

    public SolarData() {
    }


    // =====================================
    // Getters and Setters
    // =====================================

    public Long getId() {
        return id;
    }


    public double getVoltage() {
        return voltage;
    }

    public void setVoltage(double voltage) {
        this.voltage = voltage;
    }


    public double getCurrent() {
        return current;
    }

    public void setCurrent(double current) {
        this.current = current;
    }


    public double getPower() {
        return power;
    }

    public void setPower(double power) {
        this.power = power;
    }


    public double getTemperature() {
        return temperature;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }


    public double getEnergyToday() {
        return energyToday;
    }

    public void setEnergyToday(double energyToday) {
        this.energyToday = energyToday;
    }


    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    public String getPlantName() {
        return plantName;
    }

    public void setPlantName(String plantName) {
        this.plantName = plantName;
    }


    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }


    public double getCapacity() {
        return capacity;
    }

    public void setCapacity(double capacity) {
        this.capacity = capacity;
    }


    public int getTotalPanels() {
        return totalPanels;
    }

    public void setTotalPanels(int totalPanels) {
        this.totalPanels = totalPanels;
    }


    public Integer getPlantId() {
        return plantId;
    }

    public void setPlantId(Integer plantId) {
        this.plantId = plantId;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}