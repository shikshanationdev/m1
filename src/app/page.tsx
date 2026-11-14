import CareerEcosystem from "@/components/m1/CareerEcosystem";
import FacultyOrbit from "@/components/m1/FacultyOrbit";
import Ladder from "@/components/m1/Ladder";
import LevelOne from "@/components/m1/LevelOne";
import ModuleDeck from "@/components/m1/ModuleDeck";
import { PassportText, PassportViewer } from "@/components/m1/Passport";
import RegistrationForm from "@/components/m1/RegistrationForm";
import Reveal from "@/components/m1/Reveal";
import SiteHeader from "@/components/m1/SiteHeader";
import { Footer, Hero, SecHead, Vision } from "@/components/m1/StaticSections";
import { M1Mark } from "@/lib/m1";

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <SiteHeader />

      <main id="main">
        <Hero />
        <Vision />

        {/* 03 ECOSYSTEM */}
        <section className="eco-section section theme-light" id="ecosystem" aria-labelledby="eco-title">
          <div className="wrap">
            <SecHead
              idx="03"
              eyebrow="The M1 Ecosystem"
              id="eco-title"
              title={<>One ecosystem. <em>Every stage</em> of a medical career.</>}
              lede="M1 transcends standard e-learning. It integrates Learning, Mentoring, Clinical Case Knowledge, Global Networking, Research and Career Progression into a single persistent medical identity."
            />
            <CareerEcosystem />
          </div>
        </section>

        {/* 04 MODULES */}
        <ModuleDeck />

        {/* 05 LEVEL ONE */}
        <LevelOne />

        {/* 06 LADDER */}
        <section className="ladder section" id="ladder" aria-labelledby="ladder-title">
          <div className="wrap">
            <SecHead idx="06" eyebrow="The M1 Ladder" id="ladder-title" variant="tight" title={<>The first step of a <em>lifelong journey.</em></>} lede="Level One is the first step of seven." />
            <Ladder />
          </div>
        </section>

        {/* 07 FACULTY */}
        <section className="faculty section theme-light" id="faculty" aria-labelledby="fac-title">
          <div className="wrap">
            <SecHead idx="07" eyebrow="Founding Faculty" id="fac-title" variant="right" title={<>Taught by consultants <em>still in practice.</em></>} lede="Meet the founding faculty shaping the M1 educational experience." />
            <FacultyOrbit />
          </div>
        </section>

        {/* 08 PASSPORT */}
        <section className="passport section" id="passport" aria-labelledby="pp-title">
          <div className="pp-light" aria-hidden="true" />
          <div className="wrap pp-grid">
            <div className="pp-copy">
              <p className="eyebrow"><span className="idx">08</span>M1 Passport — Concept Preview</p>
              <h2 className="h2" id="pp-title">Your Medical Identity. <em>Without Borders.</em></h2>
              <p className="lede">One professional identity connecting learning, credentials, experience and career development.</p>
              <ul className="pp-points">
                <li><b>Identity</b> Who you are, in one professional record.</li>
                <li><b>Credentials</b> Qualifications and licence records in one place.</li>
                <li><b>Development</b> Lectures, workshops and CME learning over time.</li>
                <li><b>Opportunities</b> Mentorship, research and international pathways.</li>
              </ul>
              <p className="pp-disclaimer">Concept preview. The passport holder and records shown are fictional. M1 passports are not issued yet, and no credential verification or licensing integration is live.</p>
            </div>
            <PassportViewer />
          </div>
          <div className="wrap">
            <PassportText />
          </div>
        </section>

        {/* 09 REGISTER */}
        <section className="register section" id="register" aria-labelledby="reg-title">
          <M1Mark className="reg-motif" />
          <div className="wrap reg-grid">
            <div className="reg-copy">
              <p className="eyebrow"><span className="idx">09</span>Join M1</p>
              <h2 className="h2" id="reg-title">Be Part of the <em>Future of Medicine.</em></h2>
              <p className="lede">Connect with M1 and register your interest in a global community designed for continuous medical learning, mentorship and professional development.</p>
              <div className="reg-gives">
                <p className="vm-label">What registering gives you</p>
                <p>Updates on Level One enrolment and on the M1 platform as it develops, sent to the email address you register with.</p>
              </div>
            </div>
            <RegistrationForm />
          </div>
        </section>
      </main>

      <Footer />
      <Reveal />
    </>
  );
}
