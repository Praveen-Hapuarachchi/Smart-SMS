package com.example.smsbackend.services;

import com.example.smsbackend.entities.Attendance;
import com.example.smsbackend.entities.Subject;
import com.example.smsbackend.entities.User;
import com.example.smsbackend.repositories.AttendanceRepository;
import com.example.smsbackend.repositories.SubjectRepository;
import com.example.smsbackend.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private UserRepository userRepository;

    public Attendance markAttendance(Long subjectId, Long studentId, Attendance.Status status, String comment) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new EntityNotFoundException("Subject not found"));
        User student = userRepository.findById(Math.toIntExact(studentId))
                .orElseThrow(() -> new EntityNotFoundException("Student not found"));

        Attendance attendance = new Attendance();
        attendance.setDate(LocalDate.now());
        attendance.setSubject(subject);
        attendance.setStudent(student);
        attendance.setStatus(status);
        attendance.setComment(comment);

        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getAttendanceBySubjectAndDate(Long subjectId, LocalDate date) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new EntityNotFoundException("Subject not found"));
        return attendanceRepository.findBySubjectAndDate(subject, date);
    }

    public List<Attendance> getAttendanceByStudent(Long studentId) {
        User student = userRepository.findById(Math.toIntExact(studentId))
                .orElseThrow(() -> new EntityNotFoundException("Student not found"));
        return attendanceRepository.findByStudent(student);
    }

    // New method to check if attendance has been submitted for today
    public boolean hasAttendanceForToday(Long subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new EntityNotFoundException("Subject not found"));
        LocalDate today = LocalDate.now();
        List<Attendance> todaysAttendance = attendanceRepository.findBySubjectAndDate(subject, today);
        return !todaysAttendance.isEmpty(); // Return true if attendance exists for today
    }
}
