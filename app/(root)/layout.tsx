const layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <header>Header</header>
      {children}
      <footer>footer</footer>
    </>
  );
};

export default layout;
