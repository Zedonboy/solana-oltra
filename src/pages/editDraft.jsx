import { useEffect, useRef, useState } from "react";
import AddBookTitle from "../components/AddBookTitle";
import { API_URL } from "../../config";
import { useRecoilValue } from "recoil";
import { jwtState } from "../atoms";
import BookDetailForm from "../components/BookDetailsForm";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import SimpleImage from "@editorjs/simple-image";
import Image from "@editorjs/image";
import List from "@editorjs/list";
import Checklist from "@editorjs/checklist";
import CodeTool from "@editorjs/code";
import Delimiter from "@editorjs/delimiter";
import Attaches from "@editorjs/attaches";
import Embed from "@editorjs/embed";
import InlineCode from "@editorjs/inline-code";
import LinkTool from "@editorjs/link";
import Marker from "@editorjs/marker";
import NestedList from "@editorjs/nested-list";
import Paragraph from "@editorjs/paragraph";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import Warning from "@editorjs/warning";
import Underline from "@editorjs/underline";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

export default function EditDraft() {
  let ref = useRef(null);
  let params = useParams()
  let timeoutRef = useRef(null);
  let pagesRef = useRef([]);
  let [book, setBook] = useState(null);
  let [show, setShow] = useState(false);
  let [pageIndex, setPageIndex] = useState(0);
  // let [page, setPage] = useState([{}]);
  let [saving, setSaving] = useState(false);
  
  let jwt = useRecoilValue(jwtState);

  let moveNewPage = () => {
    ref.current?.destroy();
    ref.current = null;
  };
  useEffect(() => {
    if (book) {
      if (ref.current) return;
      let editor = new EditorJS({
        tools: {
          header: {
            class: Header,
            inlineToolbar: ["marker", "link"],
            config: {
              placeholder: "Header",
            },
            shortcut: "CMD+SHIFT+H",
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: "unordered",
            },
          },

          /**
           * Or pass class directly without any configuration
           */
          image: SimpleImage,

          nestedList: {
            class: NestedList,
            inlineToolbar: true,
            shortcut: "CMD+SHIFT+L",
          },

          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },

          checklist: {
            class: Checklist,
            inlineToolbar: true,
          },

          quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
              quotePlaceholder: "Enter a quote",
              captionPlaceholder: "Quote's author",
            },
            shortcut: "CMD+SHIFT+O",
          },

          warning: Warning,

          marker: {
            class: Marker,
            shortcut: "CMD+SHIFT+M",
          },

          attaches: {
            class: Attaches,
            config: {
              endpoint: "http://localhost:8008/uploadFile",
            },
          },

          code: {
            class: CodeTool,
            shortcut: "CMD+SHIFT+C",
          },

          delimiter: Delimiter,

          inlineCode: {
            class: InlineCode,
            shortcut: "CMD+SHIFT+C",
          },

          linkTool: LinkTool,

          // raw: RawTool,

          embed: Embed,

          table: {
            class: Table,
            inlineToolbar: true,
            shortcut: "CMD+ALT+T",
          },
          underline: Underline,
        },
        holder: "editorjs",
        placeholder: "Type or paste here",
        defaultBlock: "paragraph",
        data: pagesRef.current[pageIndex],
      });

      ref.current = editor;
    }
  }, [book, pageIndex]);

  useEffect(() => {
    fetch(`${API_URL}/book-drafts/${params.id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `web3auth ${jwt}`
        }
    }).then(async resp => {
        if(resp.ok){
            let draft = await resp.json()
            setBook(draft)
        }
    })
  }, [])

  useEffect(() => {
    if (book) {
      document.getElementById("editorjs")?.addEventListener("keyup", (ev) => {
        console.log("Event keyup");
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          setSaving(true);
          ref.current?.save().then((d) => {
            console.log(d);
            pagesRef.current[pageIndex] = { ...d };

            fetch(`${API_URL}/book-drafts/${params.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `web3auth ${jwt}`,
              },
              body: JSON.stringify({
                content: JSON.stringify(pagesRef.current),
              }),
            }).finally(() => {
              setSaving(false);
            });
          });
        }, 1000);
      });
    }
  }, [book, pageIndex]);

  if(book === null) {
    return null
  }

  return (
    <div className="px-12 py-8 bg-indigo-50 min-h-screen">
      <div>
        <div className="py-4 flex justify-end px-4"></div>

        <div className="w-full flex items-start">
          <div className="w-1/4 p-2 alig bg-white shadow rounded-lg">
            <div className="w-full">
              {(function () {
                if (saving) {
                  return (
                    <div className="py-4 px-2 flex items-center space-x-4">
                      <span class="relative flex h-3 w-3">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                      <p className="text-gray-400">Saving....</p>
                    </div>
                  );
                } else {
                  return (
                    <div className="py-4 px-2 flex items-center space-x-2">
                      <span class="relative flex h-6 w-6 text-gray-500">
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
                            d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                          />
                        </svg>
                      </span>
                      <p className="text-gray-400">Saved</p>
                    </div>
                  );
                }
              })()}
              {/* <div className="py-4 px-2 flex items-center space-x-4">
                <span class="relative flex h-3 w-3">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <p className="text-gray-400">saving....</p>
              </div> */}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Book Title
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    value={book.title}
                    onChange={(e) => {
                      setBook({ ...book, title: e.target.value });
                    }}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Book Title"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Description.
                </label>
                <div className="mt-1">
                  <textarea
                    rows={4}
                    value={book.desc}
                    onChange={(e) => {
                      setBook({ ...book, desc: e.target.value });
                    }}
                    name="comment"
                    id="comment"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={""}
                  />
                </div>
              </div>

              <nav
                className="isolate mt-6 inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={(e) => {
                    if (pageIndex > 0) {
                      moveNewPage();
                      setPageIndex(pageIndex - 1);
                    }
                  }}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  onClick={(e) => {
                    moveNewPage();
                    setPageIndex(0);
                  }}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronDoubleLeftIcon
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </button>
                {/* Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" */}
                <input
                  type="text"
                  value={pageIndex + 1}
                  onChange={(e) => {
                    let num = parseInt(e.target.value);
                    if (isNaN(num)) return;
                    if (num >= pagesRef.current.length) {
                      moveNewPage();
                      setPageIndex(pagesRef.current.length - 1);
                    } else {
                      moveNewPage();
                      setPageIndex(num - 1);
                    }
                  }}
                  className="block w-full text-center rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="page"
                />

                <button
                  onClick={(e) => {
                    moveNewPage();
                    setPageIndex(pagesRef.current.length - 1);
                  }}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Next</span>
                  <ChevronDoubleRightIcon
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </button>

                <button
                  onClick={(e) => {
                    if (pageIndex < pagesRef.current.length - 1) {
                      moveNewPage();
                      setPageIndex(pageIndex + 1);
                    } else if (pageIndex == pagesRef.current.length - 1) {
                      ref.current?.destroy();
                      ref.current = null;
                      // page.push({});
                      moveNewPage();
                      // setPage([...pagesRef]);
                      setPageIndex(pageIndex + 1);
                    }
                  }}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>

              <button
                onClick={(e) => {
                  let content = ref.current.getData();
                  let task = async () => {
                    let response = await fetch(`${API_URL}/books`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `web3auth ${jwt}`,
                      },

                      body: JSON.stringify({
                        ...book,
                        pages: [{ content }],
                      }),
                    });

                    if (response.ok) {
                      setShow(true);
                    }
                  };

                  task();
                }}
                type="button"
                className="w-full mt-8 items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Publish
              </button>
            </div>

            <div></div>
          </div>

          <div className="w-3/4 px-4">
            <div className="bg-white py-6 min-h-[90vh] rounded-md">
              <div id="editorjs" className="w-full prose-sm"></div>
            </div>
          </div>
        </div>
        {/* 
        <CKEditor
          onReady={(editor) => {
            console.log("Editor is ready to use!", editor);

            // Insert the toolbar before the editable area.
            editor.ui
              .getEditableElement()
              .parentElement.insertBefore(
                editor.ui.view.toolbar.element,
                editor.ui.getEditableElement()
              );

            ref.current = editor;
          }}
          onError={(error, { willEditorRestart }) => {
            // If the editor is restarted, the toolbar element will be created once again.
            // The `onReady` callback will be called again and the new toolbar will be added.
            // This is why you need to remove the older toolbar.
            if (willEditorRestart) {
              this.editor.ui.view.toolbar.element.remove();
            }
          }}
          onChange={(event, editor) => console.log({ event, editor })}
          editor={DecoupledEditor}
          data=""
          // config={  }
        /> */}
      </div>
    </div>
  );
}
