package com.example.smsbackend.controllers;

import com.example.smsbackend.entities.Attendance;
import com.example.smsbackend.services.AttendanceService;
import jakarta.persistence.EntityNotFoundException;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    // POST - Mark multiple attendances
    @PostMapping("/mark")
    public ResponseEntity<List<Attendance>> markAttendance(@RequestBody List<MarkAttendanceRequest> requests) {
        List<Attendance> attendances = requests.stream()
                .map(request -> attendanceService.markAttendance(
                        request.getSubjectId(),
                        request.getStudentId(),
                        request.getStatus(),
                        request.getComment()))
                .toList();
        return ResponseEntity.ok(attendances);
    }

    // GET - Attendance by subject and date
    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<Attendance>> getAttendanceBySubjectAndDate(
            @PathVariable Long subjectId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Attendance> attendanceList = attendanceService.getAttendanceBySubjectAndDate(subjectId, date);
        return ResponseEntity.ok(attendanceList);
    }

    // New endpoint - Check if attendance has been submitted for today
    @GetMapping("/status/{subjectId}")
    public ResponseEntity<AttendanceStatusResponse> checkAttendanceStatus(@PathVariable Long subjectId) {
        boolean submitted = attendanceService.hasAttendanceForToday(subjectId);
        return ResponseEntity.ok(new AttendanceStatusResponse(submitted));
    }

    // GET - Attendance by student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Attendance>> getAttendanceByStudent(@PathVariable Long studentId) {
        List<Attendance> attendanceList = attendanceService.getAttendanceByStudent(studentId);
        return ResponseEntity.ok(attendanceList);
    }

    // New endpoint to get conducted dates for a subject
    @GetMapping("/subject/{subjectId}/dates")
    public ResponseEntity<List<LocalDate>> getConductedDatesBySubject(@PathVariable Long subjectId) {
        try {
            List<LocalDate> dates = attendanceService.getConductedDatesBySubject(subjectId);
            return ResponseEntity.ok(dates);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @Getter
    @Setter
    static class MarkAttendanceRequest {
        private Long subjectId;
        private Long studentId;
        private Attendance.Status status;
        private String comment; // Optional
    }

    @Getter
    @Setter
    static class AttendanceStatusResponse {
        private boolean attendanceSubmitted;

        public AttendanceStatusResponse(boolean attendanceSubmitted) {
            this.attendanceSubmitted = attendanceSubmitted;
        }
    }
}