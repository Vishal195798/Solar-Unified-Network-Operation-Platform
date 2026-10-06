package com.solarplanate.solar_backend;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class SolarController {

    private final SolarDataRepository repository;

    public SolarController(SolarDataRepository repository) {
        this.repository = repository;
    }


    // =====================================
    // Get All Solar Data
    // =====================================

    @GetMapping("/solar")
    public List<SolarData> getSolarData() {
        return repository.findAll();
    }


    // =====================================
    // Get Latest Solar Data
    // =====================================

    @GetMapping("/solar/latest")
    public SolarData getLatestSolarData() {
        return repository.findTopByOrderByIdDesc();
    }


    // =====================================
    // Add Solar Reading
    // =====================================

    @PostMapping("/solar")
    public SolarData addSolarData(
            @RequestBody SolarData data) {

        data.setCreatedAt(LocalDateTime.now());

        return repository.save(data);
    }


    // =====================================
    // Energy Reports
    // =====================================

    @GetMapping("/reports")
    public Map<String, Double> getEnergyReports() {

        Map<String, Double> reports =
                new HashMap<>();

        reports.put(
                "today",
                repository.getTodayEnergy()
        );

        reports.put(
                "weekly",
                repository.getWeeklyEnergy()
        );

        reports.put(
                "monthly",
                repository.getMonthlyEnergy()
        );

        return reports;
    }


    // =====================================
    // Daily Energy History
    // =====================================

    @GetMapping("/reports/daily")
    public List<Map<String, Object>>
    getDailyEnergyHistory() {

        List<Object[]> results =
                repository.getDailyEnergyHistory();

        List<Map<String, Object>> history =
                new ArrayList<>();

        for (Object[] row : results) {

            Map<String, Object> item =
                    new HashMap<>();

            item.put(
                    "date",
                    row[0].toString()
            );

            item.put(
                    "energy",
                    ((Number) row[1]).doubleValue()
            );

            history.add(item);
        }

        return history;
    }


    // =====================================
    // Plant-wise Energy History
    // =====================================

    @GetMapping("/reports/plant/{plantId}")
    public List<Map<String, Object>>
    getPlantDailyEnergyHistory(
            @PathVariable int plantId) {

        List<Object[]> results =
                repository.getPlantDailyEnergyHistory(
                        plantId
                );

        List<Map<String, Object>> history =
                new ArrayList<>();

        for (Object[] row : results) {

            Map<String, Object> item =
                    new HashMap<>();

            item.put(
                    "date",
                    row[0].toString()
            );

            item.put(
                    "energy",
                    ((Number) row[1]).doubleValue()
            );

            history.add(item);
        }

        return history;
    }


    // =====================================
    // Current Alerts
    // =====================================

    @GetMapping("/alerts")
    public List<Map<String, String>> getAlerts() {

        SolarData latest =
                repository.findTopByOrderByIdDesc();

        if (latest == null) {

            List<Map<String, String>> noData =
                    new ArrayList<>();

            Map<String, String> alert =
                    new HashMap<>();

            alert.put("level", "INFO");
            alert.put(
                    "message",
                    "No solar data available"
            );

            noData.add(alert);

            return noData;
        }

        List<Map<String, String>> alerts =
                generateAlerts(latest);

        return alerts;
    }


    // =====================================
    // Alert History
    // =====================================

    @GetMapping("/alerts/history")
    public List<Map<String, String>>
    getAlertHistory() {

        List<SolarData> allData =
                repository.findAll();

        List<Map<String, String>> history =
                new ArrayList<>();

        for (int i = allData.size() - 1;
             i >= 0;
             i--) {

            SolarData reading =
                    allData.get(i);

            List<Map<String, String>> alerts =
                    generateAlerts(reading);

            for (Map<String, String> alert : alerts) {

                if (
                        !"OK".equals(
                                alert.get("level")
                        )
                ) {

                    Map<String, String> historyItem =
                            new HashMap<>();

                    historyItem.put(
                            "dateTime",
                            reading.getCreatedAt() != null
                                    ? reading.getCreatedAt().toString()
                                    : "Unknown"
                    );

                    historyItem.put(
                            "plantName",
                            reading.getPlantName() != null
                                    ? reading.getPlantName()
                                    : "Unknown Plant"
                    );

                    historyItem.put(
                            "level",
                            alert.get("level")
                    );

                    historyItem.put(
                            "message",
                            alert.get("message")
                    );

                    history.add(historyItem);
                }
            }
        }

        return history;
    }


    // =====================================
    // Generate Alerts
    // =====================================

    private List<Map<String, String>>
    generateAlerts(SolarData data) {

        List<Map<String, String>> alerts =
                new ArrayList<>();


        // =====================================
        // Plant OFF
        // =====================================

        if (
                data.getStatus() == null ||
                !"ON".equalsIgnoreCase(
                        data.getStatus()
                )
        ) {

            Map<String, String> alert =
                    new HashMap<>();

            alert.put(
                    "level",
                    "CRITICAL"
            );

            alert.put(
                    "message",
                    "Solar plant is OFF"
            );

            alerts.add(alert);
        }


        // =====================================
        // Temperature
        // =====================================

        double temperature =
                data.getTemperature();

        if (temperature > 80) {

            Map<String, String> alert =
                    new HashMap<>();

            alert.put(
                    "level",
                    "CRITICAL"
            );

            alert.put(
                    "message",
                    "Critical panel temperature: "
                            + temperature
                            + " °C"
            );

            alerts.add(alert);

        } else if (temperature > 70) {

            Map<String, String> alert =
                    new HashMap<>();

            alert.put(
                    "level",
                    "WARNING"
            );

            alert.put(
                    "message",
                    "High panel temperature: "
                            + temperature
                            + " °C"
            );

            alerts.add(alert);
        }


        // =====================================
        // Voltage
        // =====================================

        double voltage =
                data.getVoltage();

        if (
                voltage < 180 ||
                voltage > 260
        ) {

            Map<String, String> alert =
                    new HashMap<>();

            alert.put(
                    "level",
                    "CRITICAL"
            );

            alert.put(
                    "message",
                    "Critical voltage level: "
                            + voltage
                            + " V"
            );

            alerts.add(alert);

        } else if (
                voltage < 200 ||
                voltage > 240
        ) {

            Map<String, String> alert =
                    new HashMap<>();

            alert.put(
                    "level",
                    "WARNING"
            );

            alert.put(
                    "message",
                    "Voltage approaching limit: "
                            + voltage
                            + " V"
            );

            alerts.add(alert);
        }


        // =====================================
        // Current
        // =====================================

        double current =
                data.getCurrent();

        if (current > 25) {

            Map<String, String> alert =
                    new HashMap<>();

            alert.put(
                    "level",
                    "CRITICAL"
            );

            alert.put(
                    "message",
                    "Critical current level: "
                            + current
                            + " A"
            );

            alerts.add(alert);

        } else if (current > 20) {

            Map<String, String> alert =
                    new HashMap<>();

            alert.put(
                    "level",
                    "WARNING"
            );

            alert.put(
                    "message",
                    "High current level: "
                            + current
                            + " A"
            );

            alerts.add(alert);
        }


        // =====================================
        // Normal
        // =====================================

        if (alerts.isEmpty()) {

            Map<String, String> alert =
                    new HashMap<>();

            alert.put(
                    "level",
                    "OK"
            );

            alert.put(
                    "message",
                    "Solar Plant working normally"
            );

            alerts.add(alert);
        }


        return alerts;
    }


    // =====================================
    // Settings
    // =====================================

    @GetMapping("/settings")
    public Map<String, Object> getSettings() {

        Map<String, Object> settings =
                new HashMap<>();

        SolarData latest =
                repository.findTopByOrderByIdDesc();

        if (latest != null) {

            settings.put(
                    "plantName",
                    latest.getPlantName()
            );

            settings.put(
                    "location",
                    latest.getLocation()
            );

            settings.put(
                    "capacity",
                    latest.getCapacity()
            );

            settings.put(
                    "totalPanels",
                    latest.getTotalPanels()
            );
        }

        return settings;
    }

}