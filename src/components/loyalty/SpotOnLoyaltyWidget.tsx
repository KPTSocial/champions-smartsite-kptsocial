import React, { useEffect, useState } from 'react';

const SpotOnLoyaltyWidget = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalState, setModalState] = useState<'form' | 'success' | 'error'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthMonth: '',
    birthDay: '',
    birthYear: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    birthday: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      birthMonth: '',
      birthDay: '',
      birthYear: ''
    });
    setErrors({
      name: '',
      email: '',
      phone: '',
      birthday: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (isLoading) return;

    setIsLoading(true);
    
    let dob;
    if (formData.birthMonth && formData.birthDay && formData.birthYear) {
      const month = formData.birthMonth.length < 2 ? "0" + formData.birthMonth : formData.birthMonth;
      const day = formData.birthDay.length < 2 ? "0" + formData.birthDay : formData.birthDay;
      dob = formData.birthYear + "-" + month + "-" + day;
    }

    const pattern = /^\+1\s|[-()\s]/g;

    try {
      const response = await fetch("https://customers-bff.spoton.com/api/v1/customers/find-upsert-join", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: "+1" + formData.phone.replace(pattern, ''),
          merchantId: "672d0ac8b34c271342f0cb2e",
          source: "37",
          dob
        }),
      });

      if (response.ok) {
        setModalState('success');
        resetForm();
      } else {
        const responseText = await response.text();
        const responseError = JSON.parse(responseText);

        if (responseError.errors) {
          const { name, phone, email, phoneNumber, dob: dobErrorMessage, birthDate } = responseError.errors;

          if (phoneNumber) {
            setModalState('error');
          } else {
            setErrors({
              name: name || '',
              phone: phone || '',
              email: email || '',
              birthday: dobErrorMessage || birthDate || ''
            });
          }
        }
      }
    } catch (error) {
      setModalState('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalState('form');
    resetForm();
  };

  return (
    <>
      {/* Floating Button */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-11 z-[99] flex items-center cursor-pointer rounded-3xl p-2 max-w-[187px] w-full shadow-lg"
        style={{
          backgroundColor: '#1254cc',
          boxShadow: '0 6px 12px rgba(53, 63, 94, 0.1)'
        }}
      >
        <div
          className="min-w-[30px] h-[30px] rounded-full overflow-hidden"
          style={{
            backgroundImage: "url('https://s3.amazonaws.com/spoton-gallery/672d0ac8b34c271342f0cb2e/672d0ac8b34c271342f0cb2e/b71ad7b3-37b2-4d6c-b9c2-1f18efcfd38d.png')",
            backgroundColor: '#ffffff',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '50% 50%',
            backgroundSize: 'cover'
          }}
        />
        <div className="text-white border-l-2 border-white pl-2 ml-2 font-semibold text-xs font-['Poppins',sans-serif]">
          Join our rewards program today
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(8,3,29,0.4)]">
          <div className="bg-white relative p-6 shadow-lg rounded-lg max-w-[657px] w-full mx-4">
            {/* Header */}
            <div className="flex items-center relative">
              <div className="text-xl font-semibold font-['Poppins',sans-serif]">
                {modalState === 'error' ? (
                  <span>Ooops something went wrong</span>
                ) : (
                  <span>Rewards program</span>
                )}
              </div>
              <div
                onClick={handleCloseModal}
                className="absolute w-[30px] h-[25px] right-0 top-0 cursor-pointer"
              >
                <span className="absolute top-0 right-4 w-0.5 h-5 bg-[#08031D] transform rotate-45" />
                <span className="absolute top-0 right-4 w-0.5 h-5 bg-[#08031D] transform -rotate-45" />
              </div>
            </div>

            {/* Form Content */}
            {modalState === 'form' && (
              <div className="mt-4 text-xs text-[#08031D] font-['Poppins',sans-serif]">
                <div className="text-sm text-[#353F5E] font-['Poppins',sans-serif] mt-4 mb-3">
                  <b>Join us!</b> Sign up and start enjoying the benefits and rewards of our loyalty program.
                </div>
                
                <div className="mb-6">
                  <label className="text-xs text-[#08031D] font-['Poppins',sans-serif]" htmlFor="customer-name">
                    Name *
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="rounded mt-1 border border-[#77819C] w-full h-11 box-border px-4"
                    style={{ borderColor: errors.name ? 'red' : '#77819C' }}
                  />
                  {errors.name && (
                    <div className="mt-1 text-xs text-red-500 font-['Poppins',sans-serif]">
                      {errors.name}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="text-xs text-[#08031D] font-['Poppins',sans-serif]" htmlFor="customer-email">
                    Email *
                  </label>
                  <input
                    id="customer-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="rounded mt-1 border border-[#77819C] w-full h-11 box-border px-4"
                    style={{ borderColor: errors.email ? 'red' : '#77819C' }}
                  />
                  {errors.email && (
                    <div className="mt-1 text-xs text-red-500 font-['Poppins',sans-serif]">
                      {errors.email}
                    </div>
                  )}
                </div>

                <div className="flex items-start mt-4 gap-4">
                  <div>
                    <label className="text-xs" htmlFor="customer-birth-month">
                      Birthday (optional)
                    </label>
                    <div className="flex gap-4">
                      <input
                        id="customer-birth-month"
                        type="text"
                        maxLength={2}
                        placeholder="MM"
                        value={formData.birthMonth}
                        onChange={(e) => handleInputChange('birthMonth', e.target.value)}
                        className="rounded mt-1 border border-[#77819C] w-[58px] h-11 box-border px-4"
                        style={{ borderColor: errors.birthday ? 'red' : '#77819C' }}
                      />
                      <input
                        id="customer-birth-day"
                        type="text"
                        maxLength={2}
                        placeholder="DD"
                        value={formData.birthDay}
                        onChange={(e) => handleInputChange('birthDay', e.target.value)}
                        className="rounded mt-1 border border-[#77819C] w-[58px] h-11 box-border px-4"
                        style={{ borderColor: errors.birthday ? 'red' : '#77819C' }}
                      />
                      <input
                        id="customer-birth-year"
                        type="text"
                        maxLength={4}
                        placeholder="YYYY"
                        value={formData.birthYear}
                        onChange={(e) => handleInputChange('birthYear', e.target.value)}
                        className="rounded mt-1 border border-[#77819C] w-[70px] h-11 box-border px-4"
                        style={{ borderColor: errors.birthday ? 'red' : '#77819C' }}
                      />
                    </div>
                    {errors.birthday && (
                      <div className="mt-1 text-xs text-red-500 font-['Poppins',sans-serif]">
                        {errors.birthday}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-[#08031D] font-['Poppins',sans-serif]" htmlFor="customer-phone">
                      Phone *
                    </label>
                    <input
                      id="customer-phone"
                      type="tel"
                      placeholder="(555) 555-5555"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="rounded mt-1 border border-[#77819C] w-full h-11 box-border px-4"
                      style={{ borderColor: errors.phone ? 'red' : '#77819C' }}
                    />
                    {errors.phone && (
                      <div className="mt-1 text-xs text-red-500 font-['Poppins',sans-serif]">
                        {errors.phone}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 text-xs">
                  By clicking submit, you agree to the{' '}
                  <a href="https://www.spoton.com/legal/user-terms/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Terms of Use
                  </a>{' '}
                  and{' '}
                  <a href="https://www.spoton.com/legal/consumer-privacy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Privacy Policy
                  </a>
                  .
                </div>

                <div className="flex items-center justify-end mt-5">
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="font-['Poppins',sans-serif] text-base font-semibold rounded border border-[#1769FF] cursor-pointer bg-[#1769FF] text-white px-4 py-2 disabled:opacity-50"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}

            {/* Success Content */}
            {modalState === 'success' && (
              <div className="flex flex-col mt-4">
                <div className="font-['Poppins',sans-serif] text-[#353F5E] text-sm leading-5">
                  <b>Welcome!</b>
                  <br />
                  Provide your phone or email on your next visit to start earning.
                </div>
                <img 
                  src="https://d1rzvgj96ypnj3.cloudfront.net/images/settings/loyalty/reward_card.svg" 
                  alt="reward_card" 
                  className="mt-4"
                />
              </div>
            )}

            {/* Error Content */}
            {modalState === 'error' && (
              <div className="mt-4 max-w-[475px]">
                <div className="font-['Poppins',sans-serif] text-[#353F5E] text-sm leading-5 mb-6">
                  Please email or call SpotOn customer service for further assistance.
                </div>
                <div className="font-['Poppins',sans-serif] text-[#353F5E] text-sm leading-5 mb-11">
                  support@spoton.com / (877) 814-4102
                </div>
                <div className="flex justify-center">
                  <img 
                    src="https://d1rzvgj96ypnj3.cloudfront.net/images/settings/loyalty/reward_error.svg" 
                    alt="reward_error"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SpotOnLoyaltyWidget;