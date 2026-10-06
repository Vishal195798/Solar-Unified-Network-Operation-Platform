package com.solarplanate.solar_backend;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SolarDataRepository
        extends JpaRepository<SolarData, Long> {

    SolarData findTopByOrderByIdDesc();


    // =====================================
    // Today Energy
    // =====================================

    @Query(value = """
            SELECT COALESCE(SUM(daily_energy), 0)
            FROM (
                SELECT plant_id,
                       MAX(energy_today) AS daily_energy
                FROM solar_data
                WHERE DATE(created_at) = CURDATE()
                  AND plant_id IS NOT NULL
                GROUP BY plant_id
            ) AS today_data
            """, nativeQuery = true)
    double getTodayEnergy();


    // =====================================
    // Weekly Energy
    // =====================================

    @Query(value = """
            SELECT COALESCE(SUM(daily_energy), 0)
            FROM (
                SELECT DATE(created_at) AS report_date,
                       plant_id,
                       MAX(energy_today) AS daily_energy
                FROM solar_data
                WHERE created_at >= CURDATE() - INTERVAL 6 DAY
                  AND plant_id IS NOT NULL
                GROUP BY DATE(created_at), plant_id
            ) AS weekly_data
            """, nativeQuery = true)
    double getWeeklyEnergy();


    // =====================================
    // Monthly Energy
    // =====================================

    @Query(value = """
            SELECT COALESCE(SUM(daily_energy), 0)
            FROM (
                SELECT DATE(created_at) AS report_date,
                       plant_id,
                       MAX(energy_today) AS daily_energy
                FROM solar_data
                WHERE created_at >= CURDATE() - INTERVAL 29 DAY
                  AND plant_id IS NOT NULL
                GROUP BY DATE(created_at), plant_id
            ) AS monthly_data
            """, nativeQuery = true)
    double getMonthlyEnergy();


    // =====================================
    // All Plant Daily Energy History
    // =====================================

    @Query(value = """
            SELECT report_date,
                   SUM(daily_energy) AS energy
            FROM (
                SELECT DATE(created_at) AS report_date,
                       plant_id,
                       MAX(energy_today) AS daily_energy
                FROM solar_data
                WHERE plant_id IS NOT NULL
                GROUP BY DATE(created_at), plant_id
            ) AS plant_daily_data
            GROUP BY report_date
            ORDER BY report_date ASC
            """, nativeQuery = true)
    List<Object[]> getDailyEnergyHistory();


    // =====================================
    // Selected Plant Daily Energy History
    // =====================================

    @Query(value = """
            SELECT DATE(created_at) AS report_date,
                   MAX(energy_today) AS energy
            FROM solar_data
            WHERE plant_id = :plantId
            GROUP BY DATE(created_at)
            ORDER BY report_date ASC
            """, nativeQuery = true)
    List<Object[]> getPlantDailyEnergyHistory(
            @Param("plantId") int plantId
    );

}