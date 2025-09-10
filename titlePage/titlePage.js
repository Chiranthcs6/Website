// Dummy dataset (same IDs as mainPage.js)
const documents = [
  {
    id: 1,
    title: "Database Management Notes",
    scheme: "2020",
    branch: "Computer Science",
    sem: "4",
    year: "2nd Year",
    publisher: "Prof. Sharma",
    fileUrl: "../files/dbms-notes.pdf"
  },
  {
    id: 2,
    title: "Operating Systems Guide",
    scheme: "2022",
    branch: "Electronics",
    sem: "5",
    year: "3rd Year",
    publisher: "Dr. Mehta",
    fileUrl: "../files/os-guide.pdf"
  }
];

// Helper to read query params
function getQueryParam(param) {
  return new URLSearchParams(window.location.search).get(param);
}

function loadDocument() {
  const id = parseInt(getQueryParam("id"));
  const doc = documents.find(d => d.id === id);

  if (!doc) {
    document.body.innerHTML = "<p class='text-center text-red-500 p-10'>Document not found</p>";
    return;
  }

  // Fill details
  document.getElementById("doc-title").innerText = doc.title;
  document.getElementById("doc-scheme").innerText = doc.scheme;
  document.getElementById("doc-branch").innerText = doc.branch;
  document.getElementById("doc-sem").innerText = doc.sem;
  document.getElementById("doc-year").innerText = doc.year;
  document.getElementById("doc-publisher").innerText = doc.publisher;
  document.getElementById("doc-download").href = doc.fileUrl;
  document.getElementById("doc-file").src = doc.fileUrl;

  // Like/Dislike (just console logs for now)
  document.getElementById("likeBtn").onclick = () => console.log("Liked:", doc.title);
  document.getElementById("dislikeBtn").onclick = () => console.log("Disliked:", doc.title);
}

loadDocument();
