/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FacultyMember, WorkshopCourse, WorkshopSession, WhitelistEntry, DeanOfficialConfig, UserRole } from './types';
import { 
  INITIAL_COURSES, 
  INITIAL_FACULTY, 
  INITIAL_SESSIONS, 
  INITIAL_WHITELIST, 
  INITIAL_DEAN_CONFIG 
} from './data/mockData';
import { WhitelistLogin } from './components/auth/WhitelistLogin';
import { ProfessorDashboard } from './components/professor/ProfessorDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CourseCurriculumDrawer } from './components/course/CourseCurriculumDrawer';
import { InteractiveBookingCalendar } from './components/calendar/InteractiveBookingCalendar';
import { OfficialCertificateModal } from './components/certificate/OfficialCertificateModal';

export default function App() {
  // State with LocalStorage Persistence
  const [courses, setCourses] = useState<WorkshopCourse[]>(() => {
    const saved = localStorage.getItem('mu_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [whitelist, setWhitelist] = useState<WhitelistEntry[]>(() => {
    const saved = localStorage.getItem('mu_whitelist');
    if (saved) {
      try {
        const parsed: WhitelistEntry[] = JSON.parse(saved);
        return parsed.map((item) => {
          if (!item.passcode) {
            const match = INITIAL_WHITELIST.find((w) => w.email.toLowerCase() === item.email.toLowerCase());
            return {
              ...item,
              passcode: match?.passcode || (item.email.toLowerCase().includes('alarshad') ? 'Rashad2026@' : `MU@${item.employeeId?.replace(/[^0-9]/g, '') || '2026'}`)
            };
          }
          return item;
        });
      } catch (e) {
        return INITIAL_WHITELIST;
      }
    }
    return INITIAL_WHITELIST;
  });

  const [facultyList, setFacultyList] = useState<FacultyMember[]>(() => {
    const saved = localStorage.getItem('mu_faculty');
    return saved ? JSON.parse(saved) : INITIAL_FACULTY;
  });

  const [sessions, setSessions] = useState<WorkshopSession[]>(() => {
    const saved = localStorage.getItem('mu_sessions');
    return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
  });

  const [deanConfig, setDeanConfig] = useState<DeanOfficialConfig>(() => {
    const saved = localStorage.getItem('mu_dean_config');
    return saved ? JSON.parse(saved) : INITIAL_DEAN_CONFIG;
  });

  // Auth State
  const [currentUser, setCurrentUser] = useState<FacultyMember | null>(() => {
    const saved = localStorage.getItem('mu_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [userRole, setUserRole] = useState<UserRole | null>(() => {
    const saved = localStorage.getItem('mu_user_role');
    return (saved as UserRole) || null;
  });

  // Modals & Drawers
  const [selectedDrawerCourse, setSelectedDrawerCourse] = useState<WorkshopCourse | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [preselectedCourseForBooking, setPreselectedCourseForBooking] = useState<WorkshopCourse | null>(null);

  const [selectedCertificateSession, setSelectedCertificateSession] = useState<WorkshopSession | null>(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('mu_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('mu_whitelist', JSON.stringify(whitelist));
  }, [whitelist]);

  useEffect(() => {
    localStorage.setItem('mu_faculty', JSON.stringify(facultyList));
  }, [facultyList]);

  useEffect(() => {
    localStorage.setItem('mu_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('mu_dean_config', JSON.stringify(deanConfig));
  }, [deanConfig]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mu_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mu_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (userRole) {
      localStorage.setItem('mu_user_role', userRole);
    } else {
      localStorage.removeItem('mu_user_role');
    }
  }, [userRole]);

  // Auth Handlers
  const handleLoginSuccess = (user: FacultyMember | null, role: UserRole) => {
    setCurrentUser(user);
    setUserRole(role);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserRole(null);
  };

  // Course Drawer Handlers
  const handleOpenCourseDrawer = (course: WorkshopCourse) => {
    setSelectedDrawerCourse(course);
    setIsDrawerOpen(true);
  };

  const handleCloseCourseDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Booking Handlers
  const handleOpenBookingModal = (preselectedCourse?: WorkshopCourse) => {
    setPreselectedCourseForBooking(preselectedCourse || null);
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setPreselectedCourseForBooking(null);
  };

  const handleConfirmBooking = (sessionData: Partial<WorkshopSession>) => {
    const newSession: WorkshopSession = {
      id: `sess-${Date.now()}`,
      courseId: sessionData.courseId || '',
      courseTitle: sessionData.courseTitle || '',
      courseCode: sessionData.courseCode || '',
      professorId: sessionData.professorId || currentUser?.id || 'fac-1',
      professorName: sessionData.professorName || currentUser?.name || 'د. عضو هيئة التدريس',
      professorTitle: sessionData.professorTitle || currentUser?.title || 'أستاذ مشارك',
      professorEmail: sessionData.professorEmail || currentUser?.email || 'faculty@mu.edu.sa',
      professorPhone: sessionData.professorPhone || currentUser?.phone || '0500000000',
      department: sessionData.department || currentUser?.department || 'الكلية التطبيقية',
      campus: sessionData.campus || currentUser?.campus || 'المجمعة',
      date: sessionData.date || new Date().toISOString().split('T')[0],
      timeSlot: sessionData.timeSlot || '10:00 ص - 11:00 ص',
      hallName: sessionData.hallName || 'قاعة التدريب الذكي',
      deliveryMode: sessionData.deliveryMode || 'in_person',
      studentCountTarget: sessionData.studentCountTarget || 30,
      status: 'scheduled',
      sessionNotes: sessionData.sessionNotes,
      certificateIssued: false,
      reminderSentWhatsApp: true,
      reminderSentEmail: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setSessions((prev) => [newSession, ...prev]);
    setIsBookingModalOpen(false);
    alert('تم حجز ورشة العمل بنجاح! تم إرسال إشعار التأكيد وتفاصيل الجلسة إلى بريدك الإلكتروني الجامعي.');
  };

  // Session Completion Handler
  const handleConfirmSessionCompletion = (sessionId: string, actualStudentCount: number, feedbackNotes: string) => {
    const certNumber = `MU-AC-CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().split('T')[0];

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          return {
            ...s,
            status: 'completed',
            studentCountActual: actualStudentCount,
            sessionNotes: feedbackNotes || s.sessionNotes,
            certificateIssued: true,
            certificateId: certNumber,
            certificateIssueDate: today,
            completionConfirmedAt: `${today} ${new Date().toLocaleTimeString('ar-SA')}`,
          };
        }
        return s;
      })
    );
  };

  // Certificate Modal Handlers
  const handleOpenCertificateModal = (session: WorkshopSession) => {
    setSelectedCertificateSession(session);
    setIsCertificateModalOpen(true);
  };

  const handleCloseCertificateModal = () => {
    setIsCertificateModalOpen(false);
    setSelectedCertificateSession(null);
  };

  // Admin Whitelist Management
  const handleAddWhitelistEntry = (newEntry: Omit<WhitelistEntry, 'id' | 'addedAt'>) => {
    const entry: WhitelistEntry = {
      ...newEntry,
      id: `fac-${Date.now()}`,
      addedAt: new Date().toISOString().split('T')[0],
    };
    setWhitelist((prev) => [entry, ...prev]);

    // Also add to faculty list
    const faculty: FacultyMember = {
      id: entry.id,
      name: entry.name,
      title: entry.title,
      email: entry.email,
      phone: entry.phone,
      college: 'الكلية التطبيقية',
      department: entry.department,
      campus: entry.campus,
      employeeId: entry.employeeId,
      isWhitelisted: true,
      completedWorkshopsCount: 0,
      totalStudentsReached: 0,
    };
    setFacultyList((prev) => [faculty, ...prev]);
  };

  const handleToggleWhitelistStatus = (id: string) => {
    setWhitelist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' } : item))
    );
  };

  const handleDeleteWhitelistEntry = (id: string) => {
    setWhitelist((prev) => prev.filter((item) => item.id !== id));
  };

  // Admin Course Creation
  const handleAddNewCourse = (newCourse: WorkshopCourse) => {
    setCourses((prev) => [newCourse, ...prev]);
  };

  // Admin Session Status Update
  const handleUpdateSessionStatus = (sessionId: string, status: WorkshopSession['status']) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          const certNumber = s.certificateId || `MU-AC-CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
          return {
            ...s,
            status,
            certificateIssued: status === 'completed' ? true : s.certificateIssued,
            certificateId: status === 'completed' ? certNumber : s.certificateId,
            certificateIssueDate: status === 'completed' ? new Date().toISOString().split('T')[0] : s.certificateIssueDate,
          };
        }
        return s;
      })
    );
  };

  // Render Login View if not authenticated
  if (!userRole) {
    return (
      <WhitelistLogin
        whitelist={whitelist}
        facultyList={facultyList}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // Render Professor Dashboard
  if (userRole === 'professor' && currentUser) {
    return (
      <>
        <ProfessorDashboard
          currentProfessor={currentUser}
          courses={courses}
          sessions={sessions}
          deanConfig={deanConfig}
          onOpenBookingModal={handleOpenBookingModal}
          onOpenCourseDrawer={handleOpenCourseDrawer}
          onOpenCertificateModal={handleOpenCertificateModal}
          onConfirmSessionCompletion={handleConfirmSessionCompletion}
          onLogout={handleLogout}
        />

        {/* Course Curriculum Drawer */}
        <CourseCurriculumDrawer
          course={selectedDrawerCourse}
          isOpen={isDrawerOpen}
          onClose={handleCloseCourseDrawer}
          onSelectForBooking={(course) => handleOpenBookingModal(course)}
        />

        {/* Interactive Booking Calendar Modal */}
        <InteractiveBookingCalendar
          isOpen={isBookingModalOpen}
          onClose={handleCloseBookingModal}
          courses={courses}
          sessions={sessions}
          currentProfessor={currentUser}
          initialSelectedCourse={preselectedCourseForBooking}
          onConfirmBooking={handleConfirmBooking}
          onOpenCourseDrawer={handleOpenCourseDrawer}
        />

        {/* Official Dean-Certified Certificate Modal */}
        <OfficialCertificateModal
          session={selectedCertificateSession}
          deanConfig={deanConfig}
          isOpen={isCertificateModalOpen}
          onClose={handleCloseCertificateModal}
        />
      </>
    );
  }

  // Render Admin Dashboard
  return (
    <>
      <AdminDashboard
        sessions={sessions}
        courses={courses}
        whitelist={whitelist}
        deanConfig={deanConfig}
        onUpdateDeanConfig={setDeanConfig}
        onAddWhitelistEntry={handleAddWhitelistEntry}
        onToggleWhitelistStatus={handleToggleWhitelistStatus}
        onDeleteWhitelistEntry={handleDeleteWhitelistEntry}
        onAddNewCourse={handleAddNewCourse}
        onUpdateSessionStatus={handleUpdateSessionStatus}
        onOpenCertificateModal={handleOpenCertificateModal}
        onLogout={handleLogout}
      />

      {/* Official Certificate Modal in Admin view */}
      <OfficialCertificateModal
        session={selectedCertificateSession}
        deanConfig={deanConfig}
        isOpen={isCertificateModalOpen}
        onClose={handleCloseCertificateModal}
      />
    </>
  );
}
