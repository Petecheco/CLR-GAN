# CLR-GAN: Improving GANs Stability and Quality via Consistent Latent Representation and Reconstruction(ECCV24)

> CLR-GAN: Improving GANs Stability and Quality via Consistent Latent Representation and
> Reconstruction  <br>
> Shengke Sun, Ziqian Luan, Zhanshan Zhao, Shijie Luo and Shuzhen Han <br>
> European Conference on Computer Vision ( **ECCV** ) 2024

## ![sketchmap](CLR-GAN\figs\sketchmap.png)

This folder contains all the codes that implements the **Consistent Latent Representation and Reconstruction** method on StyleGAN-V2 and StyleGAN-V2-ADA used for reproducing the experimental results reported on the paper.

### How to use this code:

## Preparing datasets

Datasets are stored as uncompressed ZIP archives containing uncompressed PNG files and a metadata file `dataset.json` for labels.

Custom datasets can be created from a folder containing images; see `python dataset_tool.py --help` for more information. Alternatively, the folder can also be used directly as a dataset, without running it through `dataset_tool.py` first, but doing so may lead to suboptimal performance.

Legacy TFRecords datasets are not supported &mdash; see below for instructions on how to convert them.

**FFHQ**:

Step 1: Download the [Flickr-Faces-HQ dataset](https://github.com/NVlabs/ffhq-dataset) as TFRecords.

Step 2: Extract images from TFRecords using `dataset_tool.py` from the [TensorFlow version of StyleGAN2-ADA](https://github.com/NVlabs/stylegan2-ada/):

```.bash
# Using dataset_tool.py from TensorFlow version at
# https://github.com/NVlabs/stylegan2-ada/
python ../stylegan2-ada/dataset_tool.py unpack \
    --tfrecord_dir=~/ffhq-dataset/tfrecords/ffhq --output_dir=/tmp/ffhq-unpacked
```

Step 3: Create ZIP archive using `dataset_tool.py` from this repository:

```.bash
# Original 1024x1024 resolution.
python dataset_tool.py --source=/tmp/ffhq-unpacked --dest=~/datasets/ffhq.zip

# Scaled down 256x256 resolution.
#
# Note: --resize-filter=box is required to reproduce FID scores shown in the
# paper.  If you don't need to match exactly, it's better to leave this out
# and default to Lanczos.  See https://github.com/NVlabs/stylegan2-ada-pytorch/issues/283#issuecomment-1731217782
python dataset_tool.py --source=/tmp/ffhq-unpacked --dest=~/datasets/ffhq256x256.zip \
    --width=256 --height=256 --resize-filter=box
```

**AFHQ**: Download the [AFHQ dataset](https://github.com/clovaai/stargan-v2/blob/master/README.md#animal-faces-hq-dataset-afhq) and create ZIP archive:

```.bash
python dataset_tool.py --source=~/downloads/afhq/train/cat --dest=~/datasets/afhqcat.zip
python dataset_tool.py --source=~/downloads/afhq/train/dog --dest=~/datasets/afhqdog.zip
python dataset_tool.py --source=~/downloads/afhq/train/wild --dest=~/datasets/afhqwild.zip
```

**LSUN**: Download the desired categories from the [LSUN project page](https://www.yf.io/p/lsun/) and convert to ZIP archive:

```.bash
python dataset_tool.py --source=~/downloads/lsun/raw/cat_lmdb --dest=~/datasets/lsuncat200k.zip \
    --transform=center-crop --width=256 --height=256 --max_images=200000

python dataset_tool.py --source=~/downloads/lsun/raw/car_lmdb --dest=~/datasets/lsuncar200k.zip \
    --transform=center-crop-wide --width=512 --height=384 --max_images=200000
```

## Training new networks

In its most basic form, training new networks boils down to:

```.bash
python train.py --outdir=~/training-runs --data=~/mydataset.zip --gpus=1 --dry-run
python train.py --outdir=~/training-runs --data=~/mydataset.zip --gpus=1
```

The first command is optional; it validates the arguments, prints out the training configuration, and exits. The second command kicks off the actual training.

In this example, the results are saved to a newly created directory `~/training-runs/<ID>-mydataset-auto1`, controlled by `--outdir`. The training exports network pickles (`network-snapshot-<INT>.pkl`) and example images (`fakes<INT>.png`) at regular intervals (controlled by `--snap`). For each pickle, it also evaluates FID (controlled by `--metrics`) and logs the resulting scores in `metric-fid50k_full.jsonl` (as well as TFEvents if TensorBoard is installed).

The name of the output directory reflects the training configuration. For example, `00000-mydataset-auto1` indicates that the *base configuration* was `auto1`, meaning that the hyperparameters were selected automatically for training on one GPU. The base configuration is controlled by `--cfg`:

| Base config             | Description                                                                                                                                                                    |
| :---------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `auto`&nbsp;(default) | Automatically select reasonable defaults based on resolution and GPU count. Serves as a good starting point for new datasets but does not necessarily lead to optimal results. |
| `paper256`            | Reproduce results for FFHQ and LSUN Church at 256x256 using 1, 2, 4, or 8 GPUs.                                                                                                |
| `paper512`            | Reproduce results for AFHQ-Cat at 512x512 using 1, 2, 4, or 8 GPUs.                                                                                                            |

The training configuration can be further customized with additional command line options:

* `--aug=noaug` disables ADA.
* `--cond=1` enables class-conditional training (requires a dataset with labels).
* `--mirror=1` amplifies the dataset with x-flips. Often beneficial, even with ADA.
* `--resume=ffhq1024 --snap=10` performs transfer learning from FFHQ trained at 1024x1024.
* `--resume=~/training-runs/<NAME>/network-snapshot-<INT>.pkl` resumes a previous training run.
* `--gamma=10` overrides R1 gamma. We recommend trying a couple of different values for each new dataset.
* `--aug=ada --target=0.7` adjusts ADA target value (default: 0.6).
* `--augpipe=blit` enables pixel blitting but disables all other augmentations.
* `--augpipe=bgcfnc` enables all available augmentations (blit, geom, color, filter, noise, cutout).

Please refer to [`python train.py --help`](./docs/train-help.txt) for the full list.

## Model Repository

The following table lists the pre-trained GAN model that be used to reproduce the experimental results listed in paper.

| Model           | Link |
| --------------- | ---- |
| CIFAR-10        |      |
| CelebA          |      |
| AFHQ-Cat        |      |
| LSUN-Church     |      |
| ImageNet(64x64) |      |



## Acknowledgement
Thanks to [StyleGAN-ADA](https://github.com/NVlabs/stylegan2-ada-pytorch) for sharing the code.

## BibTeX

If you find our work helpful for your research, please consider to cite:

```bibtex
@inproceedings{sun2024clrgan,
    title     = {CLR-GAN: Improving GANs Stability and Quality via Consistent Latent Representation and Reconstruction},
    author    = {Sun, Shengke and Luan, Ziqian and Zhao, Zhanshan and Luo, Shijie and Han, Shuzhen},
    booktitle = {European Conference on Computer Vision},
    year      = {2024}
}
```
