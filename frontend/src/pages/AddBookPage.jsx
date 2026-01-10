import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";

import { GET_AUTHORS } from "../graphql/queries";
import { CREATE_AUTHOR, CREATE_BOOK } from "../graphql/mutations";

export default function AddBookPage() {
  const navigate = useNavigate();

  const { data: authorsData, loading: authorsLoading, refetch: refetchAuthors } = useQuery(GET_AUTHORS);
  const authors = useMemo(() => authorsData?.authors ?? [], [authorsData]);

  const [createAuthor, { loading: creatingAuthor }] = useMutation(CREATE_AUTHOR);
  const [createBook, { loading: creatingBook }] = useMutation(CREATE_BOOK);

  const [mode, setMode] = useState("existing"); // "existing" | "new"
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    title: "",
    year: "",
    description: "",
    authorId: "",
    newAuthorName: "",
  });

  // Auto-pick first author if available
  useEffect(() => {
    if (!form.authorId && authors.length > 0) {
      setForm((prev) => ({ ...prev, authorId: String(authors[0].id) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authors.length]);

  const onChange = (key) => (e) => {
    setErrorMsg("");
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  async function handleCreateAuthorIfNeeded() {
    if (mode !== "new") return Number(form.authorId);

    const name = form.newAuthorName.trim();
    if (!name) {
      setErrorMsg("Author name is required.");
      return null;
    }

    const res = await createAuthor({ variables: { name } });
    const payload = res?.data?.createAuthor;

    if (payload?.errors?.length) {
      const first = payload.errors[0];
      setErrorMsg(first.message ?? `Error: ${first.__typename}`);
      return null;
    }

    const newId = payload?.authorPayload?.author?.id;
    if (!newId) {
      setErrorMsg("Author creation failed.");
      return null;
    }

    await refetchAuthors();
    return Number(newId);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    const title = form.title.trim();
    const yearInt = Number(form.year);

    if (!title) return setErrorMsg("Title is required.");
    if (!Number.isInteger(yearInt)) return setErrorMsg("Year must be a number.");
    if (yearInt > 2026) return setErrorMsg("Year cannot be greater than 2026.");

    let authorIdInt = null;

    if (mode === "existing") {
      authorIdInt = Number(form.authorId);
      if (!Number.isInteger(authorIdInt) || authorIdInt <= 0) {
        return setErrorMsg("Please select an author.");
      }
    } else {
      authorIdInt = await handleCreateAuthorIfNeeded();
      if (!authorIdInt) return;
    }

    const res = await createBook({
      variables: {
        title,
        year: yearInt,
        description: form.description,
        authorId: authorIdInt,
      },
    });

    const payload = res?.data?.createBook;

    if (payload?.errors?.length) {
      const first = payload.errors[0];
      setErrorMsg(first.message ?? `Error: ${first.__typename}`);
      return;
    }

    const newBookId = payload?.bookPayload?.book?.id;
    if (newBookId) {
      navigate(`/books/${newBookId}`);
    } else {
      // fallback
      navigate("/library");
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 800 }}>
      <h1 style={{ marginTop: 0 }}>Add a new book</h1>

      {errorMsg ? (
        <div style={{ background: "#ffe2e2", border: "1px solid #ffb3b3", padding: 12, borderRadius: 8, marginBottom: 16 }}>
          {errorMsg}
        </div>
      ) : null}

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}>
        <label>
          Title
          <input value={form.title} onChange={onChange("title")} style={{ width: "100%", padding: 8, marginTop: 6 }} />
        </label>

        <label>
          Year
          <input value={form.year} onChange={onChange("year")} style={{ width: "100%", padding: 8, marginTop: 6 }} />
        </label>

        <label>
          Description
          <textarea value={form.description} onChange={onChange("description")} rows={6} style={{ width: "100%", padding: 8, marginTop: 6 }} />
        </label>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <b>Author</b>
          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              type="radio"
              name="authorMode"
              checked={mode === "existing"}
              onChange={() => setMode("existing")}
            />
            Select existing
          </label>
          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              type="radio"
              name="authorMode"
              checked={mode === "new"}
              onChange={() => setMode("new")}
            />
            Create new
          </label>
        </div>

        {mode === "existing" ? (
          <label>
            Choose author
            <select
              value={form.authorId}
              onChange={onChange("authorId")}
              disabled={authorsLoading}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            >
              {authorsLoading ? <option>Loading…</option> : null}
              {!authorsLoading && authors.length === 0 ? <option value="">No authors yet</option> : null}
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label>
            New author name
            <input value={form.newAuthorName} onChange={onChange("newAuthorName")} style={{ width: "100%", padding: 8, marginTop: 6 }} />
          </label>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          <button type="submit" disabled={creatingBook || creatingAuthor}>
            {creatingBook || creatingAuthor ? "Saving..." : "Create book"}
          </button>
          <button type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
