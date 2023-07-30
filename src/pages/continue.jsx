import Book from "../components/Book";
import { useNavigate } from "react-router-dom";
import { PlusIcon as PlusIconOutline } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { API_URL } from "../../config";
import { useRecoilValue } from "recoil";
import { jwtState } from "../atoms";
import { toast } from "react-toastify";
export default function Continue() {

  let navigator = useNavigate();
  let jwt = useRecoilValue(jwtState);
  let [books, setBooks] = useState([]);
  let [drafts, setDraft] = useState([]);
  let [errorMssg, setError] = useState(null);

  useEffect(() => {
    let task = async () => {
      let responseDraft = await fetch(`${API_URL}/book-drafts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `web3auth ${jwt}`,
        },
      });

      if (responseDraft.ok) {
        let data = await responseDraft.json();
        setDraft(data);
      } else {
        let data = await responseDraft.json();
        toast.error("Error your wallet is not connected.");
      }
    };

    task();
  }, []);

  console.log(books);
  return (
    <div className="py-6">
      <div className="fixed bottom-0 right-0 mb-8 mr-12">
        <button
          onClick={(e) => {
            navigator("/create-book");
          }}
          type="button"
          className="inline-flex shadow-lg items-center rounded-full border border-transparent bg-indigo-600 p-3 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <PlusIconOutline className="h-8 w-8" aria-hidden="true" />
        </button>
      </div>

      {drafts.length === 0 ? null : (
        <>
          <div className="mx-auto mt-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              Drafts
            </h1>
          </div>
          <main className="mt-8">
            <div className="mx-auto sm:px-6 lg:px-8">
              {
                <div className="grid grid-cols-5 gap-2">
                  {drafts.map((v) => (
                    <div
                    onClick={e => {
                        navigator(`/draft/${v.id}`)
                    }}
                      key={v.slug}
                      className="col-span-1 cursor-pointer flex rounded-md shadow-sm"
                    >
                      <div className="flex w-16 flex-shrink-0 bg-green-600 items-center justify-center rounded-l-md text-sm font-medium text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                          />
                        </svg>
                      </div>
                      <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
                        <div className="flex-1 truncate px-4 py-2 text-sm">
                          <a
                            href={`/edit-draft/${v.slug}`}
                            className="font-medium text-gray-900 hover:text-gray-600"
                          >
                            {v.title}
                          </a>
                          <p className="text-gray-500">Draft</p>
                        </div>
                        {/* <div className="flex-shrink-0 pr-2">
                          <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            <span className="sr-only">Open options</span>
                            <EllipsisVerticalIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </button>
                        </div> */}
                      </div>
                    </div>
                  ))}
                </div>
              }
            </div>
          </main>
          <div className="fixed bottom-0 right-0 mb-8 mr-12">
            <button
              onClick={(e) => {
                navigator("/create-book");
              }}
              type="button"
              className="inline-flex shadow-lg items-center rounded-full border border-transparent bg-indigo-600 p-3 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <PlusIconOutline className="h-8 w-8" aria-hidden="true" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
