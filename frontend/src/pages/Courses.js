import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpa } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

import { useAdmin } from "../context/AdminContext";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import { useLocalizedPath } from "../i18n/useLocalizedPath";
import { fallbackLang, formatContentDate } from "../i18n/contentLang";

const Courses = () => {
  const { t, i18n } = useTranslation("pages");
  const lang = i18n.language;
  const lp = useLocalizedPath();
  const { userId, rang } = useAuth();
  const {
    courses,
    fetchCoursesUser,
    registerCourse,
    registerCourses,
    fetchRegisteredCoursesUser,
  } = useAdmin();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [localRegisterCourses, setLocalRegisterCourses] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchCoursesUser(lang), fetchRegisteredCoursesUser()]);
      setDataLoaded(true);
    };

    if (!dataLoaded) {
      loadData();
    }
  }, [dataLoaded, fetchCoursesUser, fetchRegisteredCoursesUser, lang]);

  useEffect(() => {
    setLocalRegisterCourses(registerCourses);
  }, [registerCourses]);

  const searchEnabledUser = (beUserId, beCourseId) => {
    return localRegisterCourses.some(
      (item) =>
        parseInt(item.userId) === parseInt(beUserId) &&
        item.enabled &&
        parseInt(item.courseId) === parseInt(beCourseId)
    );
  };

  const searchNotEnabledUser = (beUserId, beCourseId) => {
    return localRegisterCourses.some(
      (item) =>
        parseInt(item.userId) === parseInt(beUserId) &&
        !item.enabled &&
        parseInt(item.courseId) === parseInt(beCourseId)
    );
  };


  const handleRegistration = async (courseId) => {
    const result = await registerCourse(userId, courseId);
    if (result === "success") {
      setLocalRegisterCourses((prev) => [
        ...prev,
        { userId, courseId, enabled: false, paid: false },
      ]);
      console.log("Sikeresen regisztráltál a kurzusra!");
    } else if (result === "registered") {
      console.log("Már regisztráltál erre a kurzusra");
    } else {
      console.log("Valami hiba történt");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full flex-1 bg-primary/60 py-16 px-4">
        <h1 className="section-heading">{t("courses.heading")}</h1>
        <div className="divider-gold mt-4 mb-12" />
        <div className="flex flex-wrap w-full justify-center gap-6">
          {dataLoaded && courses.length === 0 && (
            <div className="flex flex-col items-center text-center w-full sm:w-2/3 lg:w-1/2 my-10 mx-4 p-8 rounded-md border border-secondary/20 bg-white">
              <FontAwesomeIcon icon={faSpa} className="text-4xl mb-4 text-gold" />
              <p className="font-display text-xl font-semibold mb-2">
                {t("courses.emptyTitle")}
              </p>
              <p className="text-base text-gray-700">
                {t("courses.emptyText")}
              </p>
            </div>
          )}
          {courses.map((item) => (
            <div
              key={item.id}
              className="flex flex-col w-full lg:w-[22%] md:w-[30%] items-center min-h-[350px] rounded-md border border-secondary/30 p-4 bg-secondary/90 shadow-sm"
            >
              <div className="w-full text-center">
                <p lang={fallbackLang(item, "cim")} className="font-display text-lg tracking-wide uppercase font-semibold">
                  {item.cim}
                </p>
                <div lang={fallbackLang(item, "temakor")} className="text-sm text-ink/70">
                  {item.temakor !== "" ? item.temakor : " "}
                </div>
              </div>
              <div className="w-full flex flex-col md:flex-row text-base border-b border-b-gold/40 my-3 pb-2">
                <div lang={fallbackLang(item, "helyszin")} className="w-full md:w-1/2 text-sm text-left">
                  {item.helyszin}
                </div>
                <div className="w-full md:w-1/2 text-sm text-right">
                  {formatContentDate(item.idopont, lang)}
                </div>
              </div>
              <div lang={fallbackLang(item, "leiras")} className="mb-3 min-h-[200px] text-sm text-center">{item.leiras}</div>
              <div className="flex w-full flex-col gap-2 justify-center items-center mt-auto">
                <div className="w-full rounded-md text-center text-sm py-2 bg-ivory font-medium">
                  {t("courses.price", { amount: item.ar })}
                </div>

                {rang === "a" ? (
                  <Link
                    to={lp("course", { id: item.id })}
                    className="w-full btn-brand py-2 text-sm cursor-pointer"
                  >
                    {t("courses.view")}
                  </Link>
                ) : userId === null ? (
                  <Link
                    to={lp("register")}
                    className="w-full btn-brand py-2 text-sm"
                  >
                    {t("courses.createAccount")}
                  </Link>
                ) : localRegisterCourses && searchEnabledUser(userId, item.id) ? (
                  <Link
                    to={lp("course", { id: item.id })}
                    className="w-full btn-brand py-2 text-sm cursor-pointer"
                  >
                    {t("courses.view")}
                  </Link>
                ) : localRegisterCourses && searchNotEnabledUser(userId, item.id) ? (
                  <div className="w-full rounded-md text-center text-sm py-2 bg-ivory">
                    {t("courses.alreadyRegistered")}
                  </div>
                ) : (
                  <div
                    className="w-full btn-brand py-2 text-sm cursor-pointer"
                    onClick={() => handleRegistration(item.id)}
                  >
                    {t("courses.register")}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Courses;
