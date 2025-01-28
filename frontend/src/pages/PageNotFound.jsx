function PageNotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1 style={{ fontSize: "150px" }}>404</h1>
      <h3>Page Not Found</h3>
    </div>
  );
}

export default PageNotFound;
