import { CKEditor } from "@ckeditor/ckeditor5-react";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import { useRef, useState } from "react";
import AddBookTitle from "../components/AddBookTitle";
import { API_URL } from "../../config";
import { useRecoilValue } from "recoil";
import { jwtState } from "../atoms";
import BookDetailForm from "../components/BookDetailsForm";
export default function CreateBook() {
  let ref = useRef(null);
  let [book, setBook] = useState(null);
  let [show, setShow] = useState(false);
  let jwt = useRecoilValue(jwtState);
  if (book === null) {
    return (
      <div className="px-12 py-8 flex justify-center">
        <BookDetailForm
          onSave={(d) => {
            setBook(d);
          }}
        />
      </div>
    );
  }
  return (
    <div className="px-12 py-8 bg-indigo-50 h-screen">
      <div className="bg-white">
        <div className="py-4 flex justify-end px-4">
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

                if(response.ok) {
                  setShow(true)
                }
              };

              task()
            }}
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Publish
          </button>
        </div>

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
        />
      </div>
    </div>
  );
}
