import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-blue-fusion text-cloud-dancer/75">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:items-start">
          <div>
            <h3 className="text-cloud-dancer text-lg font-bold mb-3">백제약품</h3>
            <p className="text-sm leading-relaxed text-cloud-dancer/75">
              더 엄격하게 운영하고, 더 오래 함께합니다.<br />
              지금 백제약품과 연결을 시작하세요.
            </p>
          </div>

          <div className="md:min-w-[310px]">
            <h4 className="text-cloud-dancer text-sm font-semibold mb-3">연락처</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2 text-sm">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>서울특별시 영등포구 여의대로 108</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone size={16} className="shrink-0" />
                <span>02-2650-0114</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail size={16} className="shrink-0" />
                <span>info@baikje.co.kr</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-cloud-dancer/20 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-cloud-dancer/55">
            &copy; 2024 백제약품. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link to="#" className="text-xs text-cloud-dancer/55 hover:text-golden-mist transition-colors">
              개인정보처리방침
            </Link>
            <Link to="#" className="text-xs text-cloud-dancer/55 hover:text-golden-mist transition-colors">
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
