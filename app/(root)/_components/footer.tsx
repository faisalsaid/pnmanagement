import React from 'react';

const WebFooter = () => {
  return (
    <footer className="bg-accent border-t py-8 absolute w-full bottom-0">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-muted-foreground">
        <div>
          <h4 className="font-semibold  mb-3">Kategori</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="">
                Politik
              </a>
            </li>
            <li>
              <a href="#" className="">
                Ekonomi
              </a>
            </li>
            <li>
              <a href="#" className="">
                Teknologi
              </a>
            </li>
            <li>
              <a href="#" className="">
                Hiburan
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold  mb-3">Informasi</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="">
                Tentang Kami
              </a>
            </li>
            <li>
              <a href="#" className="">
                Kontak
              </a>
            </li>
            <li>
              <a href="#" className="">
                Karier
              </a>
            </li>
            <li>
              <a href="#" className="">
                Kebijakan Privasi
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold  mb-3">Layanan</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="">
                Berlangganan
              </a>
            </li>
            <li>
              <a href="#" className="">
                Newsletter
              </a>
            </li>
            <li>
              <a href="#" className="">
                Iklan
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold  mb-3">Ikuti Kami</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="">
                Facebook
              </a>
            </li>
            <li>
              <a href="#" className="">
                Twitter
              </a>
            </li>
            <li>
              <a href="#" className="">
                Instagram
              </a>
            </li>
            <li>
              <a href="#" className="">
                YouTube
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-6">
        © 2025 Portal Berita. Semua hak dilindungi.
      </div>
    </footer>
  );
};

export default WebFooter;
