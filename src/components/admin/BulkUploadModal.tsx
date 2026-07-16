import { useState, useRef } from 'react'
import { X, Upload, AlertTriangle, CheckCircle2, FileText, Download } from 'lucide-react'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import type { AdminProductInput } from '../../types/adminProduct'
import { createBulkAdminProducts, adminCategoryOptions } from '../../services/productService'

interface BulkUploadModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function BulkUploadModal({ onClose, onSuccess }: BulkUploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<{ successful: number, failed: { index: number, reason: string, name: string }[] } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
      setResults(null)
    }
  }

  const downloadTemplate = () => {
    const headers = [
      'Name *',
      'Price *',
      'MRP',
      'Product Image *',
      'Secondary Image',
      'Category *',
      'Sizes',
      'Stock Quantity *',
      'Product Code (SKU)',
      'Description',
      'On Sale',
      'Best Seller',
      'New Arrival',
      'Material',
      'Design Pattern',
      'Occasion',
      'Length',
      'Neckline',
      'Sleeve Length'
    ]
    const sampleRow = [
      'Sample Product',
      1999,
      2499,
      'https://example.com/image.jpg',
      '',
      'one-piece',
      'M, L, XL',
      10,
      'SKU-001',
      'Beautiful dress',
      'FALSE',
      'TRUE',
      'FALSE',
      'Cotton',
      'Printed',
      'Casual',
      'Knee Length',
      'Round',
      'Half'
    ]

    const ws = XLSX.utils.aoa_to_sheet([headers, sampleRow])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Template')
    XLSX.writeFile(wb, 'bulk_upload_template.xlsx')
  }

  const parseBoolean = (val: string) => {
    if (!val) return false
    const lower = val.toString().toLowerCase().trim()
    return lower === 'true' || lower === 'yes' || lower === '1'
  }

  const processRows = async (rows: Record<string, any>[]) => {
    const inputs: AdminProductInput[] = []
    const validationErrors: string[] = []

    for (let idx = 0; idx < rows.length; idx++) {
      const rawRow = rows[idx]
      const row: Record<string, string> = {}
      for (const key in rawRow) {
        const cleanKey = key.replace(' *', '').trim()
        row[cleanKey] = rawRow[key] !== undefined && rawRow[key] !== null ? String(rawRow[key]) : ''
      }

      const name = row['Name']?.trim()
      const price = parseFloat(row['Price'])
      let image = row['Product Image']?.trim()
      const categoryRaw = row['Category']?.trim()
      const stock = parseInt(row['Stock Quantity'])
      let secondaryImage = row['Secondary Image']?.trim()
      
      if (!name) { validationErrors.push(`Row ${idx + 1}: Name is required`); continue }
      if (isNaN(price)) { validationErrors.push(`Row ${idx + 1}: Price must be a valid number`); continue }
      if (!image) { validationErrors.push(`Row ${idx + 1}: Product Image is required`); continue }
      if (!categoryRaw) { validationErrors.push(`Row ${idx + 1}: Category is required`); continue }
      if (isNaN(stock)) { validationErrors.push(`Row ${idx + 1}: Stock Quantity must be a valid number`); continue }

      if (image && !image.startsWith('http')) {
        validationErrors.push(`Row ${idx + 1}: Product Image must be a valid URL (starting with http). Please use the Media Gallery to get image URLs.`)
        continue
      }

      if (secondaryImage && !secondaryImage.startsWith('http')) {
        validationErrors.push(`Row ${idx + 1}: Secondary Image must be a valid URL (starting with http). Please use the Media Gallery to get image URLs.`)
        continue
      }

      let categorySlug = categoryRaw
      const matchedCategory = adminCategoryOptions.find(c => c.label.toLowerCase() === categoryRaw?.toLowerCase() || c.slug.toLowerCase() === categoryRaw?.toLowerCase())
      if (matchedCategory) {
        categorySlug = matchedCategory.slug
      }

      const productDetails: Record<string, string> = {}
      const detailsKeys = ['Material', 'Design Pattern', 'Occasion', 'Length', 'Neckline', 'Sleeve Length']
      detailsKeys.forEach(k => {
        if (row[k]?.trim()) {
          productDetails[k] = row[k].trim()
        }
      })

      const sizesText = row['Sizes']?.trim() || 'M, L, XL, 2XL'
      const sizes = sizesText.split(',').map((s) => s.trim()).filter(Boolean)

      inputs.push({
        name,
        price,
        originalPrice: row['MRP'] ? parseFloat(row['MRP']) : undefined,
        image,
        additionalImages: secondaryImage ? [secondaryImage] : undefined,
        categorySlug,
        sizes: sizes.length ? sizes : ['M', 'L', 'XL', '2XL'],
        stockQuantity: stock,
        sku: row['Product Code (SKU)']?.trim(),
        shortDescription: '',
        description: row['Description']?.trim() || '',
        onSale: parseBoolean(row['On Sale']),
        isBestSeller: parseBoolean(row['Best Seller']),
        isNew: parseBoolean(row['New Arrival']),
        productDetails: Object.keys(productDetails).length ? productDetails : undefined,
      })
    }

    if (validationErrors.length > 0) {
      setError(validationErrors.slice(0, 5).join('\n') + (validationErrors.length > 5 ? `\n...and ${validationErrors.length - 5} more errors.` : ''))
      setUploading(false)
      return
    }

    try {
      const uploadRes = await createBulkAdminProducts(inputs)
      setResults(uploadRes)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error during upload')
    } finally {
      setUploading(false)
    }
  }

  const handleUpload = () => {
    if (!file) return

    setUploading(true)
    setError(null)

    if (file.name.toLowerCase().endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (resultsParse) => {
          await processRows(resultsParse.data as Record<string, any>[])
        },
        error: (err) => {
          setError(`Error parsing CSV: ${err.message}`)
          setUploading(false)
        }
      })
    } else if (file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls')) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' })
          await processRows(rows as Record<string, any>[])
        } catch (err) {
          setError(`Error parsing Excel file: ${err instanceof Error ? err.message : 'Unknown error'}`)
          setUploading(false)
        }
      }
      reader.readAsArrayBuffer(file)
    } else {
      setError('Unsupported file type. Please upload a .csv or .xlsx file.')
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-cream shadow-xl border border-accent p-6 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl text-charcoal flex items-center gap-2">
            <Upload size={20} />
            Bulk Upload CSV / Excel
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-charcoal/60 hover:bg-black/5 hover:text-charcoal transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto pr-2">
          {!results ? (
            <div className="space-y-6">
              <div className="text-sm text-charcoal/80 space-y-3">
                <p>Upload a <strong>.csv</strong> or <strong>.xlsx</strong> (Excel) file to add multiple products at once.</p>
                <p className="text-xs text-charcoal/60 bg-accent/50 p-3 border border-accent rounded">
                  <strong>Important:</strong> Image columns must now contain URLs. Use the <strong>Media Gallery</strong> to get your image URLs before uploading!
                </p>
                <button 
                  onClick={downloadTemplate}
                  className="flex items-center gap-1.5 text-maroon hover:underline font-medium text-xs tracking-wide uppercase"
                >
                  <Download size={14} />
                  Download Excel Template
                </button>
              </div>

              <div className="max-w-xs mx-auto">
                <div 
                  className="border-2 border-dashed border-accent rounded p-6 text-center flex flex-col items-center justify-center bg-accent/50 cursor-pointer hover:bg-accent transition-colors h-[160px]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <FileText size={28} className="text-charcoal/40 mb-3" />
                  {file ? (
                    <p className="text-sm font-medium text-charcoal px-2">{file.name}</p>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-charcoal">Upload Excel/CSV</p>
                      <p className="text-xs text-charcoal/50 mt-1">.csv, .xlsx, .xls only</p>
                    </>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded text-sm border border-red-200 whitespace-pre-wrap">
                  <div className="flex items-center gap-2 mb-1 font-semibold">
                    <AlertTriangle size={16} /> Error
                  </div>
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-accent">
                <button
                  type="button"
                  onClick={onClose}
                  className="border border-accent px-5 py-2 text-xs font-medium tracking-[0.15em] text-charcoal uppercase hover:border-maroon hover:text-maroon transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="bg-maroon px-5 py-2 text-xs font-medium tracking-[0.15em] text-cream uppercase hover:bg-maroon-light transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {uploading ? 'Uploading...' : 'Upload Products'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-center py-4">
              <div className="flex justify-center mb-4">
                <CheckCircle2 size={48} className="text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-charcoal">Upload Complete!</h3>
              <p className="text-sm text-charcoal/70">
                Successfully added <span className="font-bold text-charcoal">{results.successful}</span> products.
              </p>

              {results.failed.length > 0 && (
                <div className="mt-6 text-left">
                  <p className="text-sm font-medium text-red-600 mb-2 flex items-center gap-1.5">
                    <AlertTriangle size={16} />
                    Failed to add {results.failed.length} products:
                  </p>
                  <ul className="text-xs text-charcoal/70 space-y-2 bg-red-50 p-3 rounded border border-red-100 max-h-40 overflow-y-auto">
                    {results.failed.map((f, i) => (
                      <li key={i}>
                        <span className="font-medium">{f.name}</span> (Row {f.index + 1}): {f.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8">
                <button
                  onClick={() => {
                    onSuccess()
                    onClose()
                  }}
                  className="w-full bg-maroon px-5 py-2.5 text-xs font-medium tracking-[0.15em] text-cream uppercase hover:bg-maroon-light transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
