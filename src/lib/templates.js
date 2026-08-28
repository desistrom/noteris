// Document templates for different akta types
export const documentTemplates = {
  // Pendirian Perusahaan
  PT_Pendirian: {
    title: 'Akta Pendirian Perseroan Terbatas',
    fields: [
      { name: 'companyName', label: 'Nama Perusahaan', required: true },
      { name: 'address', label: 'Alamat Kantor', required: true },
      { name: 'capital', label: 'Modal Dasar', required: true },
      { name: 'directors', label: 'Nama Direktur', required: true },
      { name: 'commissioners', label: 'Nama Komisaris', required: false },
      { name: 'shareholders', label: 'Nama Pemegang Saham', required: true },
      { name: 'businessPurpose', label: 'Tujuan Usaha', required: true },
    ],
    stages: [
      'Pengecekan Nama PT',
      'Penyusunan Akta',
      'Penandatanganan Akta',
      'Pengajuan SK Kemenkumham',
      'Penerbitan SK',
      'Selesai',
    ],
  },
  PT_Perubahan: {
    title: 'Akta Perubahan Anggaran Dasar PT',
    fields: [
      { name: 'companyName', label: 'Nama Perusahaan', required: true },
      { name: 'changeType', label: 'Jenis Perubahan', required: true },
      { name: 'oldProvision', label: 'Ketentuan Lama', required: true },
      { name: 'newProvision', label: 'Ketentuan Baru', required: true },
      { name: 'directors', label: 'Nama Direktur', required: true },
    ],
    stages: [
      'Rapat Umum Pemegang Saham',
      'Penyusunan Akta Perubahan',
      'Penandatanganan Akta',
      'Pengajuan ke Kemenkumham',
      'Penerbitan SK Perubahan',
      'Selesai',
    ],
  },
  Yayasan_Pendirian: {
    title: 'Akta Pendirian Yayasan',
    fields: [
      { name: 'foundationName', label: 'Nama Yayasan', required: true },
      { name: 'address', label: 'Alamat Yayasan', required: true },
      { name: 'purpose', label: 'Tujuan Yayasan', required: true },
      { name: 'founders', label: 'Nama Pendiri', required: true },
      { name: 'boardMembers', label: 'Anggota Pembina', required: true },
      { name: 'initialAssets', label: 'Kekayaan Awal', required: true },
    ],
    stages: [
      'Pengecekan Nama Yayasan',
      'Penyusunan Akta',
      'Penandatanganan Akta',
      'Pengajuan SK Kemenkumham',
      'Penerbitan SK',
      'Selesai',
    ],
  },
  Yayasan_Perubahan: {
    title: 'Akta Perubahan Anggaran Dasar Yayasan',
    fields: [
      { name: 'foundationName', label: 'Nama Yayasan', required: true },
      { name: 'changeType', label: 'Jenis Perubahan', required: true },
      { name: 'oldProvision', label: 'Ketentuan Lama', required: true },
      { name: 'newProvision', label: 'Ketentuan Baru', required: true },
    ],
    stages: [
      'Rapat Pembina',
      'Penyusunan Akta Perubahan',
      'Penandatanganan Akta',
      'Pengajuan ke Kemenkumham',
      'Penerbitan SK Perubahan',
      'Selesai',
    ],
  },
  CV_Pendirian: {
    title: 'Akta Pendirian CV',
    fields: [
      { name: 'cvName', label: 'Nama CV', required: true },
      { name: 'address', label: 'Alamat Usaha', required: true },
      { name: 'generalPartners', label: 'Sekutu Pengurus', required: true },
      { name: 'limitedPartners', label: 'Sekutu Komanditer', required: true },
      { name: 'capital', label: 'Modal', required: true },
      { name: 'businessPurpose', label: 'Tujuan Usaha', required: true },
    ],
    stages: [
      'Penyusunan Akta',
      'Penandatanganan Akta',
      'Pendaftaran ke Kemenkumham',
      'Penerbitan SK',
      'Selesai',
    ],
  },
  CV_Perubahan: {
    title: 'Akta Perubahan CV',
    fields: [
      { name: 'cvName', label: 'Nama CV', required: true },
      { name: 'changeType', label: 'Jenis Perubahan', required: true },
      { name: 'oldProvision', label: 'Ketentuan Lama', required: true },
      { name: 'newProvision', label: 'Ketentuan Baru', required: true },
    ],
    stages: [
      'Musyawarah Sekutu',
      'Penyusunan Akta Perubahan',
      'Penandatanganan Akta',
      'Pengajuan ke Kemenkumham',
      'Penerbitan SK Perubahan',
      'Selesai',
    ],
  },
  Koperasi_Pendirian: {
    title: 'Akta Pendirian Koperasi',
    fields: [
      { name: 'coopName', label: 'Nama Koperasi', required: true },
      { name: 'address', label: 'Alamat Koperasi', required: true },
      { name: 'founders', label: 'Nama Pendiri', required: true },
      { name: 'capital', label: 'Modal Awal', required: true },
      { name: 'purpose', label: 'Tujuan Koperasi', required: true },
    ],
    stages: [
      'Rapat Pendirian',
      'Penyusunan Akta',
      'Penandatanganan Akta',
      'Pengajuan ke Dinas Koperasi',
      'Penerbitan SK',
      'Selesai',
    ],
  },
  Koperasi_Perubahan: {
    title: 'Akta Perubahan Koperasi',
    fields: [
      { name: 'coopName', label: 'Nama Koperasi', required: true },
      { name: 'changeType', label: 'Jenis Perubahan', required: true },
      { name: 'oldProvision', label: 'Ketentuan Lama', required: true },
      { name: 'newProvision', label: 'Ketentuan Baru', required: true },
    ],
    stages: [
      'Rapat Anggota',
      'Penyusunan Akta Perubahan',
      'Penandatanganan Akta',
      'Pengajuan ke Dinas Koperasi',
      'Penerbitan SK Perubahan',
      'Selesai',
    ],
  },
  // Transaksi Aset
  Jual_Beli_Tanah: {
    title: 'Akta Jual Beli Tanah',
    fields: [
      { name: 'sellerName', label: 'Nama Penjual', required: true },
      { name: 'buyerName', label: 'Nama Pembeli', required: true },
      { name: 'landLocation', label: 'Lokasi Tanah', required: true },
      { name: 'landArea', label: 'Luas Tanah (m²)', required: true },
      { name: 'landCertificate', label: 'Nomor Sertifikat', required: true },
      { name: 'price', label: 'Harga Jual Beli', required: true },
      { name: 'paymentMethod', label: 'Cara Pembayaran', required: true },
    ],
    stages: [
      'Verifikasi Dokumen Tanah',
      'Cek Sertifikat di BPN',
      'Penyusunan Akta',
      'Penandatanganan Akta',
      'Pembayaran BPHTB',
      'Pendaftaran ke BPN',
      'Selesai',
    ],
  },
  Jual_Beli_Properti: {
    title: 'Akta Jual Beli Properti',
    fields: [
      { name: 'sellerName', label: 'Nama Penjual', required: true },
      { name: 'buyerName', label: 'Nama Pembeli', required: true },
      { name: 'propertyLocation', label: 'Lokasi Properti', required: true },
      { name: 'propertyType', label: 'Jenis Properti', required: true },
      { name: 'buildingArea', label: 'Luas Bangunan (m²)', required: true },
      { name: 'landArea', label: 'Luas Tanah (m²)', required: true },
      { name: 'price', label: 'Harga Jual Beli', required: true },
    ],
    stages: [
      'Verifikasi Dokumen Properti',
      'Cek Sertifikat di BPN',
      'Penyusunan Akta',
      'Penandatanganan Akta',
      'Pembayaran BPHTB',
      'Pendaftaran ke BPN',
      'Selesai',
    ],
  },
  Jual_Beli_Kendaraan: {
    title: 'Akta Jual Beli Kendaraan',
    fields: [
      { name: 'sellerName', label: 'Nama Penjual', required: true },
      { name: 'buyerName', label: 'Nama Pembeli', required: true },
      { name: 'vehicleType', label: 'Jenis Kendaraan', required: true },
      { name: 'vehicleBrand', label: 'Merk Kendaraan', required: true },
      { name: 'vehicleYear', label: 'Tahun Pembuatan', required: true },
      { name: 'vehicleNumber', label: 'Nomor Polisi', required: true },
      { name: 'engineNumber', label: 'Nomor Mesin', required: true },
      { name: 'chassisNumber', label: 'Nomor Rangka', required: true },
      { name: 'price', label: 'Harga Jual Beli', required: true },
    ],
    stages: [
      'Verifikasi Dokumen Kendaraan',
      'Cek BPKB',
      'Penyusunan Akta',
      'Penandatanganan Akta',
      'Balik Nama di Samsat',
      'Selesai',
    ],
  },
  // Perjanjian
  Perjanjian_Kredit: {
    title: 'Perjanjian Kredit',
    fields: [
      { name: 'creditorName', label: 'Nama Pemberi Kredit', required: true },
      { name: 'debtorName', label: 'Nama Penerima Kredit', required: true },
      { name: 'loanAmount', label: 'Jumlah Pinjaman', required: true },
      { name: 'interestRate', label: 'Suku Bunga', required: true },
      { name: 'loanTerm', label: 'Jangka Waktu', required: true },
      { name: 'collateral', label: 'Jaminan', required: false },
      { name: 'repaymentSchedule', label: 'Jadwal Pembayaran', required: true },
    ],
    stages: [
      'Negosiasi Syarat Kredit',
      'Penyusunan Perjanjian',
      'Review Hukum',
      'Penandatanganan Perjanjian',
      'Pencairan Kredit',
      'Selesai',
    ],
  },
  Perjanjian_Sewa: {
    title: 'Perjanjian Sewa-Menyewa',
    fields: [
      { name: 'lessorName', label: 'Nama Pihak yang Menyewakan', required: true },
      { name: 'lesseeName', label: 'Nama Pihak Penyewa', required: true },
      { name: 'objectLeased', label: 'Objek yang Disewakan', required: true },
      { name: 'leasePeriod', label: 'Jangka Waktu Sewa', required: true },
      { name: 'rentAmount', label: 'Jumlah Sewa', required: true },
      { name: 'paymentSchedule', label: 'Jadwal Pembayaran', required: true },
      { name: 'deposit', label: 'Uang Jaminan', required: false },
    ],
    stages: [
      'Negosiasi Syarat Sewa',
      'Penyusunan Perjanjian',
      'Review Hukum',
      'Penandatanganan Perjanjian',
      'Serah Terima Objek',
      'Selesai',
    ],
  },
  Perjanjian_Kerjasama: {
    title: 'Perjanjian Kerja Sama Bisnis',
    fields: [
      { name: 'partyAName', label: 'Nama Pihak Pertama', required: true },
      { name: 'partyBName', label: 'Nama Pihak Kedua', required: true },
      { name: 'cooperationType', label: 'Jenis Kerja Sama', required: true },
      { name: 'cooperationScope', label: 'Ruang Lingkup', required: true },
      { name: 'profitSharing', label: 'Pembagian Keuntungan', required: true },
      { name: 'duration', label: 'Jangka Waktu', required: true },
      { name: 'responsibilities', label: 'Kewajiban Masing-masing Pihak', required: true },
    ],
    stages: [
      'Negosiasi Kerja Sama',
      'Penyusunan Perjanjian',
      'Review Hukum',
      'Penandatanganan Perjanjian',
      'Implementasi Kerja Sama',
      'Selesai',
    ],
  },
  Perjanjian_Pengakuan_Utang: {
    title: 'Perjanjian Pengakuan Utang',
    fields: [
      { name: 'creditorName', label: 'Nama Kreditor', required: true },
      { name: 'debtorName', label: 'Nama Debitor', required: true },
      { name: 'debtAmount', label: 'Jumlah Utang', required: true },
      { name: 'debtOrigin', label: 'Asal Usul Utang', required: true },
      { name: 'repaymentDate', label: 'Tanggal Jatuh Tempo', required: true },
      { name: 'collateral', label: 'Jaminan', required: false },
    ],
    stages: [
      'Verifikasi Utang',
      'Penyusunan Perjanjian',
      'Review Hukum',
      'Penandatanganan Perjanjian',
      'Selesai',
    ],
  },
  // Waris dan Hibah
  Akta_Hak_Waris: {
    title: 'Akta Hak Waris',
    fields: [
      { name: 'deceasedName', label: 'Nama Almarhum/Almarhumah', required: true },
      { name: 'deceasedDate', label: 'Tanggal Meninggal', required: true },
      { name: 'heirs', label: 'Nama Ahli Waris', required: true },
      { name: 'relationship', label: 'Hubungan dengan Almarhum', required: true },
      { name: 'inheritedAssets', label: 'Harta Warisan', required: true },
      { name: 'distribution', label: 'Pembagian Warisan', required: true },
    ],
    stages: [
      'Verifikasi Dokumen Kematian',
      'Pendataan Ahli Waris',
      'Inventarisasi Harta Warisan',
      'Penyusunan Akta',
      'Penandatanganan Akta',
      'Selesai',
    ],
  },
  Akta_Wasiat: {
    title: 'Akta Wasiat',
    fields: [
      { name: 'testatorName', label: 'Nama Pewasiat', required: true },
      { name: 'testatorIdentity', label: 'Identitas Pewasiat', required: true },
      { name: 'beneficiaries', label: 'Nama Penerima Wasiat', required: true },
      { name: 'bequeathedAssets', label: 'Harta yang Diwasiatkan', required: true },
      { name: 'conditions', label: 'Syarat-syarat', required: false },
      { name: 'executor', label: 'Pelaksana Wasiat', required: true },
    ],
    stages: [
      'Konsultasi dengan Pewasiat',
      'Penyusunan Akta Wasiat',
      'Penandatanganan Akta',
      'Pendaftaran di Pusat Daftar Wasiat',
      'Selesai',
    ],
  },
  Akta_Hibah: {
    title: 'Akta Hibah',
    fields: [
      { name: 'donorName', label: 'Nama Pemberi Hibah', required: true },
      { name: 'doneeName', label: 'Nama Penerima Hibah', required: true },
      { name: 'giftedAssets', label: 'Harta yang Dihibahkan', required: true },
      { name: 'assetValue', label: 'Nilai Harta', required: true },
      { name: 'conditions', label: 'Syarat-syarat Hibah', required: false },
    ],
    stages: [
      'Verifikasi Dokumen',
      'Penyusunan Akta Hibah',
      'Penandatanganan Akta',
      'Pembayaran Bea Perolehan',
      'Peralihan Hak',
      'Selesai',
    ],
  },
};

export function getTemplate(aktaType) {
  return documentTemplates[aktaType] || null;
}

export function getAllAktaTypes() {
  return Object.keys(documentTemplates).map((key) => ({
    value: key,
    label: documentTemplates[key].title,
    category: getCategory(key),
  }));
}

function getCategory(type) {
  if (type.includes('PT_') || type.includes('Yayasan_') || type.includes('CV_') || type.includes('Koperasi_')) {
    return 'Pendirian Perusahaan';
  }
  if (type.includes('Jual_Beli_')) {
    return 'Transaksi Aset';
  }
  if (type.includes('Perjanjian_')) {
    return 'Perjanjian';
  }
  if (type.includes('Akta_')) {
    return 'Waris dan Hibah';
  }
  return 'Lainnya';
}
