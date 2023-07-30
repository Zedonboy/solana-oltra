import { Fragment, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import RowSection from "./components/RowSection";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MyBooks from "./pages/myBooks";
import CreateBook from "./pages/createBook";
import { API_URL } from "../config";
import bs58 from 'bs58'


const navigation = [
  { name: "Home", href: "#", current: true },
  { name: "My Books", href: "/#/my-books", current: false },
  { name: "Continue", href: "/#/continue", current: false },
  { name: "Bookmarks", href: "/#/bookmark", current: false },
];

import { useRecoilState } from "recoil";
import { jwtState } from "./atoms";
import Summary from "./pages/Summary";
import Read from "./pages/read";
import EditDraft from "./pages/editDraft";
import Continue from "./pages/continue";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [jwt, setJwt] = useRecoilState(jwtState);
  const [currentNav, setCurrentNav] = useState(0);
  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="border-b border-gray-200 bg-white">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                  <div className="flex">
                    <div className="flex flex-shrink-0 items-center">
                      <img
                        className="block h-8 w-auto lg:hidden"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                      />
                      <img
                        className="hidden h-8 w-auto lg:block"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                      />
                    </div>
                    <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                      {navigation.map((item, i) => (
                        <button
                          key={item.name}
                          onClick={(e) => {
                            navigation[currentNav].current = false;
                            navigation[i].current = true;
                            setCurrentNav(i);
                            window.location.href = item.href;
                          }}
                          className={classNames(
                            item.current
                              ? "border-indigo-500 text-gray-900"
                              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                            "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:items-center">
                    {jwt ? (
                      <button
                        onClick={(e) => {
                          setJwt(null);
                        }}
                        type="button"
                        className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        Disconnect Wallet
                      </button>
                    ) : (
                      (function () {
                        const isPhantomInstalled = window.phantom?.solana?.isPhantom

                        if(!isPhantomInstalled) {
                          return  <button
                          onClick={(e) => {
                            window.open('https://phantom.app/', '_blank');
                          }}
                          type="button"
                          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Download Phantom Wallet
                        </button>
                        }

                        const provider = window.phantom?.solana;
                        return (
                          <button
                            onClick={(e) => {
                              let task1 = async () => {
                               
                                let resp = await fetch(`${API_URL}/sessions`);
                                let data = await resp.json();

                               
                                const phantom_resp = await provider.connect()
                               
                                const encodedMessage = new TextEncoder().encode(data.key);
                                const {message, signature} = await provider.signMessage(encodedMessage, "utf8");
                                
                                let address = phantom_resp.publicKey.toString()
                                resp = await fetch(`${API_URL}/sessions`, {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json"
                                  },
                                  body: JSON.stringify({
                                    key: data.key,
                                    address,
                                    signature: bs58.encode(signature)
                                  }),
                                });

                                data = await resp.json();
                                setJwt(data.jwt);
                              };

                              task1().catch(err => {
                                console.log(err)
                              });
                            }}
                            // disabled={jwt}
                            type="button"
                            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            Connect Wallet
                          </button>
                        );
                      })()
                    )}

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          <span className="sr-only">Open user menu</span>
                          {/* <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" /> */}
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"></Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                  <div className="-mr-2 flex items-center sm:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="sm:hidden">
                <div className="space-y-1 pt-2 pb-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                          : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800",
                        "block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <HashRouter>
          <Routes>

            <Route path="/" index element={<Home />}></Route>

            <Route path="/my-books" index element={<MyBooks />}></Route>

            <Route path="/create-book" index element={<CreateBook />}></Route>

            <Route path="/summary/book/:id" element={<Summary />} />

            <Route path="/read/:id" element={<Read />} />

            <Route path="/draft/:id" element={<EditDraft/>}/>

            <Route path="/continue" element={<Continue/>}/>
          </Routes>
        </HashRouter>
      </div>
    </>
  );
}
