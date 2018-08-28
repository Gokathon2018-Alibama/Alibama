import numpy as np
import cv2 as cv
from urllib.request import urlopen, Request

url1 = 'https://s3-ap-southeast-1.amazonaws.com/alibamabucket/7.jpg'
req = urlopen(url1)
arr = np.asarray(bytearray(req.read()), dtype=np.uint8)
img1 = cv.imdecode(arr, -1)
# img1 = cv.resize(img1, None, fx=0.1, fy=0.1, interpolation=cv.INTER_AREA)

url2 = 'https://s3-ap-southeast-1.amazonaws.com/alibamabucket/8.jpg'
req = urlopen(url2)
arr = np.asarray(bytearray(req.read()), dtype=np.uint8)
img2 = cv.imdecode(arr, -1)
# img2 = cv.resize(img2, None, fx=0.1, fy=0.1, interpolation=cv.INTER_AREA)

url3 = 'https://s3-ap-southeast-1.amazonaws.com/alibamabucket/9.jpg'
req = urlopen(url3)
arr = np.asarray(bytearray(req.read()), dtype=np.uint8)
img3 = cv.imdecode(arr, -1)
# img3 = cv.resize(img3, None, fx=0.1, fy=0.1, interpolation=cv.INTER_AREA)

# img1 = cv.imread('images/x0.1 (3).jpg')
# img2 = cv.imread('images/x0.1 (8).jpg')
# img3 = cv.imread('images/x0.1 desert.jpg')

pt1 = (50,100)
pt2 = (150,300)
rec1 = pt1 + pt2

pt3 = (100,100)
pt4 = (200,300)
rec2 = pt3 + pt4

#img4 = cv.line(img1, pt1, pt2,  (255, 0, 0), 3)
#img5 = cv.line(img2, pt3, pt4,  (255, 0, 0), 3)

#cv.imshow("1", img4)
#cv.imshow("2", img5)

mask1 = np.zeros(img1.shape[:2],np.uint8)
mask2 = np.zeros(img2.shape[:2],np.uint8)

bgdModel = np.zeros((1,65),np.float64)
fgdModel = np.zeros((1,65),np.float64)

cv.grabCut(img1, mask1, rec1, bgdModel, fgdModel, 5, cv.GC_INIT_WITH_RECT)
mask1_2 = np.where((mask1 == 2) | (mask1 == 0), 0, 1).astype('uint8')
img1 = img1*mask1_2[:, :, np.newaxis]
#cv.imshow("4", img1)

cv.grabCut(img2, mask2, rec2, bgdModel, fgdModel, 5, cv.GC_INIT_WITH_RECT)
mask2_2 = np.where((mask2 == 2) | (mask2 == 0), 0, 1).astype('uint8')
img2 = img2*mask2_2[:,:,np.newaxis]
#cv.imshow("5", img2)

img1 = img1.astype(float)
img2 = img2.astype(float)

person = cv.add(img1, img2)
#cv.imwrite("images/result99.jpg", person)
alpha = person
#cv.imshow("a1", alpha)
#cv.imwrite("images/a1.jpg", alpha)
alpha = person*255
#cv.imshow("a2", alpha)
cv.imwrite("images/alpha.jpg", alpha)

##### a2 works #####

#foreground = cv.imread("images/person.jpg")
foreground = person
#background = cv.imread("images/x0.1 desert.jpg")
background = img3
alpha = cv.imread("images/alpha.jpg")

# Convert uint8 to float
foreground = foreground.astype(float)
background = background.astype(float)

# Normalize the alpha mask to keep intensity between 0 and 1
alpha = alpha.astype(float) / 255

# Multiply the foreground with the alpha matte
foreground = cv.multiply(alpha, foreground)

# Multiply the background with ( 1 - alpha )
background = cv.multiply(1.0 - alpha, background)

# Add the masked foreground and background.
outImage = cv.add(foreground, background)

# Display image
cv.imshow("outImg", outImage / 255)
cv.imwrite("images/result.jpg", outImage)
cv.waitKey(0)
