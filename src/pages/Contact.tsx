import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, ChevronDown } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const contactCategories = [
  {
    title: '구매',
    items: [
      { label: '약국', phone: '02-2650-0114', email: 'pharmacy@baikje.co.kr' },
      { label: '병원', phone: '02-2650-0224', email: 'hospital@baikje.co.kr' },
      { label: '도매', phone: '02-2650-0334', email: 'wholesale@baikje.co.kr' },
    ],
  },
  {
    title: '판매',
    items: [
      { label: '의약품 유통', phone: '02-2650-0444', email: 'sales@baikje.co.kr' },
    ],
  },
  {
    title: '유통',
    items: [
      { label: '3PL', phone: '02-2650-0554', email: '3pl@baikje.co.kr' },
      { label: '4PL', phone: '02-2650-0664', email: '4pl@baikje.co.kr' },
      { label: '총판', phone: '02-2650-0774', email: 'dist@baikje.co.kr' },
    ],
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    message: '',
  });
  const [openCategory, setOpenCategory] = useState<string | null>('구매');

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-neutral-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Contact"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary-400 text-sm font-semibold tracking-widest uppercase mb-3">
              Contact
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              고객 문의
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Contact Categories */}
      <section className="py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
          <div className="space-y-4 mb-16">
            {contactCategories.map((cat) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="border border-neutral-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() =>
                    setOpenCategory(openCategory === cat.title ? null : cat.title)
                  }
                  className="w-full flex items-center justify-between p-6 hover:bg-neutral-50 transition-colors"
                >
                  <h3 className="text-xl font-bold text-neutral-900">{cat.title}</h3>
                  <ChevronDown
                    size={20}
                    className={`text-neutral-400 transition-transform duration-300 ${
                      openCategory === cat.title ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openCategory === cat.title && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-neutral-100"
                  >
                    <div className="p-6 space-y-4">
                      {cat.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-neutral-50 rounded-lg"
                        >
                          <span className="font-semibold text-neutral-900 mb-2 sm:mb-0">
                            {item.label}
                          </span>
                          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                            <a
                              href={`tel:${item.phone}`}
                              className="flex items-center gap-2 text-sm text-neutral-600 hover:text-primary-700 transition-colors"
                            >
                              <Phone size={14} />
                              {item.phone}
                            </a>
                            <a
                              href={`mailto:${item.email}`}
                              className="flex items-center gap-2 text-sm text-neutral-600 hover:text-primary-700 transition-colors"
                            >
                              <Mail size={14} />
                              {item.email}
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-8">
              기타 문의사항
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert('문의가 접수되었습니다.');
                  }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        이름
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-primary-700 focus:ring-1 focus:ring-primary-700 outline-none transition-colors text-sm"
                        placeholder="이름을 입력해주세요"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        이메일
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-primary-700 focus:ring-1 focus:ring-primary-700 outline-none transition-colors text-sm"
                        placeholder="이메일을 입력해주세요"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        연락처
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-primary-700 focus:ring-1 focus:ring-primary-700 outline-none transition-colors text-sm"
                        placeholder="연락처를 입력해주세요"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        문의 유형
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-primary-700 focus:ring-1 focus:ring-primary-700 outline-none transition-colors text-sm bg-white"
                      >
                        <option value="">선택해주세요</option>
                        <option value="purchase">구매 문의</option>
                        <option value="sales">판매 문의</option>
                        <option value="logistics">유통 문의</option>
                        <option value="other">기타</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      문의 내용
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-primary-700 focus:ring-1 focus:ring-primary-700 outline-none transition-colors text-sm resize-none"
                      placeholder="문의 내용을 입력해주세요"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-primary-700 hover:bg-primary-800 text-white font-semibold rounded-lg transition-colors"
                  >
                    <Send size={16} />
                    문의 접수
                  </button>
                </form>
              </div>

              <div>
                <div className="bg-neutral-50 rounded-2xl p-8 space-y-6">
                  <div>
                    <h3 className="font-bold text-neutral-900 mb-3">본사</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin size={16} className="mt-1 text-primary-700 shrink-0" />
                        <p className="text-sm text-neutral-600">
                          서울특별시 영등포구 여의대로 108
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone size={16} className="text-primary-700 shrink-0" />
                        <p className="text-sm text-neutral-600">02-2650-0114</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail size={16} className="text-primary-700 shrink-0" />
                        <p className="text-sm text-neutral-600">info@baikje.co.kr</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-200 pt-6">
                    <h3 className="font-bold text-neutral-900 mb-3">운영 시간</h3>
                    <div className="space-y-1.5 text-sm text-neutral-600">
                      <p>월 - 금: 09:00 - 18:00</p>
                      <p>토요일: 09:00 - 13:00</p>
                      <p className="text-neutral-400">일요일 및 공휴일: 휴무</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
