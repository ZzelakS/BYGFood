import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

export default function Modal({
  name,
  address,
  email,
  phoneNumber,
  location,
  setName,
  setAddress,
  setEmail,
  setPhoneNumber,
  handleLocationChange,
  buyNow,
}) {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <div className="  text-center rounded-lg text-white font-bold">
        <button
          type="button"
          onClick={openModal}
          className="w-full  bg-orange-600 py-2 text-center rounded-lg text-white font-bold "
        >
          Buy Now
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl p-2  text-left align-middle shadow-xl transition-all bg-gray-50">
                  <section className="">
                    <div className="flex flex-col items-center justify-center py-8 mx-auto  lg:py-0">
                      <div className="w-full  rounded-lg md:mt-0 sm:max-w-md xl:p-0 ">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                          <form className="space-y-4 md:space-y-6" action="#">
                            <div>
                              <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900"
                              >
                                Enter Full Name
                              </label>
                              <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                type="name"
                                name="name"
                                id="name"
                                className=" border outline-0 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-100"
                                required
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="address"
                                className="block mb-2 text-sm font-medium text-gray-900"
                              >
                                Enter Full Address
                              </label>
                              <input
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                type="text"
                                name="address"
                                id="address"
                                className=" border outline-0 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-100"
                                required
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-gray-900"
                              >
                                Enter Email
                              </label>
                              <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="text"
                                name="email"
                                id="email"
                                className=" border outline-0 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-100"
                                required
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="mobileNumber"
                                className="block mb-2 text-sm font-medium text-gray-900"
                              >
                                Enter Mobile Number
                              </label>
                              <input
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                type="text"
                                name="mobileNumber"
                                id="mobileNumber"
                                className=" border outline-0 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-100"
                                required
                              />
                            </div>
                            <select
                              value={location}
                              onChange={(e) =>
                                handleLocationChange(e.target.value)
                              }
                              className=" border outline-0 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-100"
                            >
                              <option value="">Select Location</option>
                              <option value="Victoria Island">Victoria Island</option>
                              <option value="Ikoyi">Ikoyi</option>
                              <option value="Lekki Phase 1">Lekki Phase 1</option>
                              <option value="Ikota">Ikota</option>
                              <option value="Chevron">Chevron</option>
                              <option value="Agungi">Agungi</option>
                              <option value="Jakande-Lekki">Jakande-Lekki</option>
                              <option value="Ajah">Ajah</option>
                              <option value="Sangotedo">Sangotedo</option>
                              <option value="Awoyaya">Awoyaya</option>
                              <option value="Ikeja">Ikeja</option>
                              <option value="Ikotun">Ikotun</option>
                              <option value="Isolo">Isolo</option>
                              <option value="Yaba">Yaba</option>
                              <option value="Egbeda">Egbeda</option>
                              <option value="Surulere">Surulere</option>
                              <option value="Magodo-Shangisha">Magodo-Shangisha</option>
                              <option value="Berger">Berger</option>
                              <option value="Palm Grove">Palm Grove</option>
                              <option value="Others - Island">Others - Island</option>
                              <option value="Others - Mainland">Others - Mainland</option>
                              {/* <option value="Others">Others</option>
                              <option value="Test">Test</option> */}
                            </select>
                          </form>
                          <button
                            onClick={() => {
                              buyNow();
                              closeModal();
                            }}
                            type="button"
                            className="focus:outline-none w-full text-white bg-orange-600 hover:bg-orange-800  outline-0 font-medium rounded-lg text-sm px-5 py-2.5 "
                          >
                            Order Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
