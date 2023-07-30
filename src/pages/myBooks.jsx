import Book from "../components/Book";
import { useNavigate } from "react-router-dom";
import { PlusIcon as PlusIconOutline } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { API_URL } from "../../config";
import { useRecoilValue } from "recoil";
import { jwtState } from "../atoms";
import { toast } from "react-toastify";
export default function MyBooks() {
  let navigator = useNavigate();
  let jwt = useRecoilValue(jwtState);
  let [books, setBooks] = useState([]);
  let [drafts, setDraft] = useState([]);
  let [errorMssg, setError] = useState(null);
  useEffect(() => {
    let task = async () => {
      let response = await fetch(`${API_URL}/books`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `web3auth ${jwt}`,
        },
      });

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
        toast.error(data.error.message);
      }

      if (response.ok) {
        let data = await response.json();
        setBooks(data);
      } else {
        let data = await response.json();
        toast.error(data.error.message);
      }
    };

    task();
  }, []);

  console.log(books);
  return (
    <div className="py-6">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
          My Books
        </h1>
      </div>
      <main className="mt-8">
        <div className="mx-auto sm:px-6 lg:px-8">
          {books.length === 0 ? (
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No projects
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new project.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <PlusIconOutline
                    className="-ml-1 mr-2 h-5 w-5"
                    aria-hidden="true"
                  />
                  New Book
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2">
              {books.data.map((v) => (
                <Book {...v.attributes} />
              ))}
            </div>
          )}
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

     
    </div>
  );
}
