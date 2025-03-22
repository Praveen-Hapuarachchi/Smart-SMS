package com.example.smsbackend.repositories;

import com.example.smsbackend.entities.Attendance;
import com.example.smsbackend.entities.Subject;
import com.example.smsbackend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findBySubjectAndDate(Subject subject, LocalDate date);
    List<Attendance> findByStudent(User student);
}
