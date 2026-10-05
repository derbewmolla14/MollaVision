import { Link } from 'react-router-dom';
import { FiArrowLeft, FiDownload } from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';


const Certificates = () => {
  const { user } = useAuth();
  const issuedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());
  const certificateUrl = window.location.href;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="container-custom py-10 print:hidden">
        <Link to="/dashboard" className="mb-6 inline-flex items-center gap-2 font-medium text-blue-600 hover:text-blue-700">
          <FiArrowLeft size={18} />
          Back to Dashboard
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Achievement unlocked</p>
            <h1 className="mt-2 text-4xl font-bold text-slate-900">Certificate of completion</h1>
            <p className="mt-2 text-slate-600">Your MollaVision learning milestone.</p>
          </div>
          <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700">
            <FiDownload size={18} />
            Print / Save PDF
          </button>
        </div>
      </div>

      <div className="certificate-page container-custom pb-16 print:p-0">
        <article className="certificate relative mx-auto max-w-4xl overflow-hidden bg-[#fbfaf5] px-6 py-10 text-center text-slate-900 shadow-[0_18px_60px_rgba(15,23,42,0.16)] sm:px-14 sm:py-14 lg:px-24 lg:py-16">
          <div className="pointer-events-none absolute inset-4 border border-[#c9b983] sm:inset-6" />
          <div className="pointer-events-none absolute inset-7 border border-[#e4dcc2] sm:inset-9" />

          <div className="relative flex justify-end">
            <div className="flex flex-col items-center gap-1 text-[#173d5d]">
              <QRCodeSVG value={certificateUrl} size={72} bgColor="#fbfaf5" fgColor="#173d5d" includeMargin />
              <span className="text-[9px] font-semibold uppercase tracking-wider">Scan to view</span>
            </div>
          </div>

          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border-4 border-[#b99955] text-2xl font-bold text-[#173d5d] shadow-inner background-url(/)">
            <span className="absolute -top-5 text-xl text-[#b99955]">✦</span>
            <img src="/mollavission.png" alt="mollavision" />
          </div>

          <p className="relative mt-3 text-sm font-bold tracking-[0.3em] text-[#173d5d]">MOLLAVISION</p>

          <div className="relative mt-12">
            <p className="font-serif text-4xl font-bold uppercase tracking-wide text-[#173d5d] sm:text-5xl">Certificate</p>
            <p className="mt-1 font-serif text-2xl uppercase tracking-[0.18em] text-[#173d5d] sm:text-3xl">of completion</p>
            <div className="mx-auto mt-5 h-px w-24 bg-[#b99955]" />
          </div>

          <p className="relative mt-12 font-serif text-lg text-slate-700 sm:text-xl">This is to certify that</p>
          <h2 className="relative mt-5 break-words font-serif text-3xl font-bold uppercase tracking-wide text-[#10253b] sm:text-4xl">{user?.name || 'MollaVision Learner'}</h2>
          <div className="relative mx-auto mt-3 h-px max-w-lg bg-[#b99955]" />

          <p className="relative mx-auto mt-8 max-w-2xl font-serif text-lg leading-relaxed text-slate-700 sm:text-xl">
            has successfully completed the<br />
            <span className="font-bold text-[#173d5d]">Full Stack Development Course</span><br />
            at MollaVision
          </p>

          <p className="relative mx-auto mt-8 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            This comprehensive program included hands-on training in front-end and back-end technologies, database management, and full-stack integration.
          </p>

          <p className="relative mt-8 font-serif text-base text-slate-700">Issued on {issuedDate}</p>

          <div className="relative mt-12 flex flex-col items-center justify-between gap-10 sm:flex-row sm:items-end sm:gap-8">
            <div className="mx-auto sm:mx-0">
              <div className="certificate-seal flex h-28 w-28 items-center justify-center rounded-full ">
                <img src="/mollavision-signaturs.png" alt="MollaVision executive signature" className="mx-auto h-28  w-28 max-w-[260px] object-contain" />
              </div>
            </div>
            <div className="min-w-0 flex-1 sm:max-w-xs">
              <img src="/mollavision-signature.png" alt="MollaVision executive signature" className="mx-auto h-16 w-full max-w-[260px] object-contain" />
              <div className="mt-1 border-t border-slate-700 pt-2 text-sm text-slate-700">Chief Executive Officer, MollaVision</div>
            </div>
          </div>

          <p className="relative mt-10 text-xs tracking-widest text-slate-500">CERTIFICATE ID: MV-{user?.id?.slice(-8).toUpperCase() || 'LEARNER'}</p>
        </article>
      </div>
    </div>
  );
};

export default Certificates;
