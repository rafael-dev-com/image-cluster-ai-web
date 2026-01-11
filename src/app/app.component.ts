import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Cluster {
  name: string;
  image_ids: string[];
  description?: string;
}

interface UploadedImage {
  file: File;
  previewUrl: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AppComponent {
  selectedImages: UploadedImage[] = [];
  clusters: Cluster[] = [];
  maxFiles = 24;
  maxDimension = 600; // px
  maxSize = 1 * 1024 * 1024; // 1 MB
  showLimitMessage = false;
  loading = false;

  async onFilesSelected(event: any) {
    const files: FileList = event.target.files;
    this.showLimitMessage = false;
    let addedCount = 0;

    for (let i = 0; i < files.length; i++) {
      if (this.selectedImages.length >= this.maxFiles) {
        this.showLimitMessage = true;
        break;
      }

      let file = files[i];
      if (!file.type.startsWith('image/')) continue;

      file = await this.resizeImage(file);
      const previewUrl = await this.getPreview(file);
      this.selectedImages.push({ file, previewUrl });
      addedCount++;
    }

    if (addedCount === 0 && files.length > 0) this.showLimitMessage = true;
  }

  resizeImage(file: File): Promise<File> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        let { width, height } = img;

        if (width <= this.maxDimension && height <= this.maxDimension && file.size <= this.maxSize) {
          resolve(file);
          return;
        }

        const canvas = document.createElement('canvas');
        if (width > height) {
          if (width > this.maxDimension) {
            height = Math.round((height * this.maxDimension) / width);
            width = this.maxDimension;
          }
        } else {
          if (height > this.maxDimension) {
            width = Math.round((width * this.maxDimension) / height);
            height = this.maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx!.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (!blob) resolve(file);
          else resolve(new File([blob], file.name, { type: file.type }));
        }, file.type, 0.8);
      };
    });
  }

  getPreview(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e: any) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  async sendImages() {
    if (this.selectedImages.length === 0) return;

    this.loading = true;

    const formData = new FormData();
    this.selectedImages.forEach(img => formData.append('files', img.file));

    try {
      const response = await fetch('http://127.0.0.1:8000/cluster-images', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        alert('Error enviando imágenes');
        this.loading = false;
        return;
      }

      const data = await response.json();
      const clustersFromApi: Cluster[] = data.clusters || [];

      this.clusters = clustersFromApi.map(cluster => {
        const imagesInCluster = cluster.image_ids
          .map(id => this.selectedImages.find(img => img.file.name === id))
          .filter(Boolean) as UploadedImage[];

        return {
          name: cluster.name,
          description: cluster.description,
          image_ids: imagesInCluster.map(img => img.previewUrl)
        };
      });
    } catch (err) {
      console.error(err);
      alert('Error enviando imágenes');
    } finally {
      this.loading = false;
    }
  }

  reset() {
    this.selectedImages = [];
    this.clusters = [];
    this.showLimitMessage = false;
    this.loading = false;

    const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
    if (fileInput) fileInput.value = '';
  }
}
