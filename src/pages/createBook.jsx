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
import { useNavigate } from "react-router-dom";

export default function CreateBook() {
  let ref = useRef(null);
  let timeoutRef = useRef(null);
  let pagesRef = useRef([]);
  let [book, setBook] = useState(null);
  let [show, setShow] = useState(false);
  let [pageIndex, setPageIndex] = useState(0);
  // let [page, setPage] = useState([{}]);
  let [saving, setSaving] = useState(false);
  let [draftSlug, setDraftSlug] = useState(null);
  let jwt = useRecoilValue(jwtState);
  let navigate = useNavigate()

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

  if (book === null) {
    return (
      <div className="px-12 py-8 flex justify-center">
        <BookDetailForm
          onSave={(d) => {
            fetch(`${API_URL}/book-drafts`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `web3auth ${jwt}`,
              },
              body: JSON.stringify({
                title: d.title,
                desc: d.desc,
                content: null,
              }),
            }).then((resp) => {
              if (resp.ok) {
                resp.json().then((data) => {
                  navigate(`/draft/${data.id}`)
                  // setDraftSlug(data.slug);
                  // setBook(d);
                });
              } else {
                toast.error("Could not create book");
              }
            });
            // setBook(d);
          }}
        />
      </div>
    );
  }

}
