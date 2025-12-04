import { fal } from "@fal-ai/client";
import { Picker } from "@react-native-picker/picker";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import "react-native-url-polyfill/auto";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { SignOutButton } from "@/app/components/SignOutButton";

// Configure FAL API key
// IMPORTANT: In a production app, this should be stored securely
// For dev purposes, we'll set it directly
const FAL_KEY =
  // "you'll never get my API Keys 🖕";
fal.config({
  credentials: FAL_KEY,
});

// Virtual Try-On Component (only shown when signed in)
function VirtualTryOnApp() {
  const { user } = useUser();
  const [modelImage, setModelImage] = useState<string | null>(null);
  const [garmentImage, setGarmentImage] = useState<string | null>(null);
  const [modelImageUrl, setModelImageUrl] = useState<string>("");
  const [garmentImageUrl, setGarmentImageUrl] = useState<string>("");
  const [category, setCategory] = useState<string>("tops");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(13); // Tracking remaining credits

  // Request permissions on component mount
  useEffect(() => {
    (async () => {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== "granted" || mediaStatus !== "granted") {
        Alert.alert(
          "Permissions needed",
          "Camera and media library permissions are required for this app to work."
        );
      }

      // Also request permissions to save photos
      if (Platform.OS !== "web") {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission needed",
            "We need permission to save images to your gallery."
          );
        }
      }
    })();
  }, []);

  // Pick an image from camera or library
  const pickImage = async (
    source: "camera" | "library",
    type: "model" | "garment"
  ) => {
    try {
      let result;

      if (source === "camera") {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [3, 4],
          quality: 1,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [3, 4],
          quality: 1,
        });
      }

      if (!result.canceled) {
        const uri = result.assets[0].uri;

        if (type === "model") {
          setModelImage(uri);
          setModelImageUrl(""); // Clear URL input when image is selected
        } else {
          setGarmentImage(uri);
          setGarmentImageUrl(""); // Clear URL input when image is selected
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  // Function to convert local URI to base64
  const uriToBase64 = async (uri: string) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error("Error converting to base64:", error);
      throw error;
    }
  };

  // Process try-on request
  const processTryOn = async () => {
    if (credits <= 0) {
      Alert.alert(
        "No Credits",
        "You have used all your credits. Please upgrade your account."
      );
      return;
    }

    try {
      setLoading(true);

      // Get model image (either from local file or URL)
      let modelImageData = modelImageUrl;
      if (modelImage && !modelImageUrl) {
        modelImageData = await uriToBase64(modelImage);
      }

      // Get garment image (either from local file or URL)
      let garmentImageData = garmentImageUrl;
      if (garmentImage && !garmentImageUrl) {
        garmentImageData = await uriToBase64(garmentImage);
      }

      // Validate inputs
      if (!modelImageData && !garmentImageData) {
        Alert.alert(
          "Missing Images",
          "Please provide both model and garment images"
        );
        setLoading(false);
        return;
      }

      // Call the FAL API
      const apiResult = await fal.subscribe("fashn/tryon", {
        input: {
          model_image: modelImageData,
          garment_image: garmentImageData,
          category: category as "tops" | "bottoms" | "one-pieces",
          garment_photo_type: "auto",
          nsfw_filter: true,
          guidance_scale: 2,
          timesteps: 50,
          seed: 42,
          num_samples: 1,
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            console.log(
              "Processing:",
              update.logs?.map((log) => log.message)
            );
          }
        },
      });

      // Process result
      if (apiResult.data?.images && apiResult.data.images.length > 0) {
        setResult(apiResult.data.images[0].url);
        setCredits((prev) => prev - 1); // Decrement credits
      } else {
        Alert.alert("Error", "Failed to generate try-on image");
      }
    } catch (error) {
      console.error("Error processing try-on:", error);
      Alert.alert("Error", "Failed to process try-on request");
    } finally {
      setLoading(false);
    }
  };

  // Save result image to device gallery
  const saveImage = async () => {
    if (!result) return;

    try {
      // First download the image
      const fileUri = `${
        FileSystem.documentDirectory
      }fashn-tryon-${Date.now()}.jpg`;
      const downloadResult = await FileSystem.downloadAsync(result, fileUri);

      if (downloadResult.status === 200) {
        // Save to media library
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        Alert.alert("Success", "Image saved to gallery");
      } else {
        Alert.alert("Error", "Failed to download image");
      }
    } catch (error) {
      console.error("Error saving image:", error);
      Alert.alert("Error", "Failed to save image");
    }
  };

  // Clear all inputs and results
  const resetAll = () => {
    setModelImage(null);
    setGarmentImage(null);
    setModelImageUrl("");
    setGarmentImageUrl("");
    setResult(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header with user info and sign out */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>FASHN Virtual Try-On</Text>
            <Text style={styles.welcomeText}>
              Welcome, {user?.emailAddresses[0].emailAddress}
            </Text>
            <Text style={styles.credits}>Credits remaining: {credits}</Text>
          </View>
          <SignOutButton />
        </View>

        {/* Model Image Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Model Image</Text>

          {modelImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: modelImage }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => setModelImage(null)}
              >
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.uploadContainer}>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => pickImage("library", "model")}
              >
                <Text style={styles.uploadButtonText}>Choose from Library</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => pickImage("camera", "model")}
              >
                <Text style={styles.uploadButtonText}>Take Photo</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.orText}>- OR -</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter model image URL"
            value={modelImageUrl}
            onChangeText={setModelImageUrl}
          />
        </View>

        {/* Garment Image Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Garment Image</Text>

          {garmentImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: garmentImage }}
                style={styles.imagePreview}
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => setGarmentImage(null)}
              >
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.uploadContainer}>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => pickImage("library", "garment")}
              >
                <Text style={styles.uploadButtonText}>Choose from Library</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => pickImage("camera", "garment")}
              >
                <Text style={styles.uploadButtonText}>Take Photo</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.orText}>- OR -</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter garment image URL"
            value={garmentImageUrl}
            onChangeText={setGarmentImageUrl}
          />
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              style={styles.picker}
              onValueChange={(itemValue) => setCategory(itemValue)}
            >
              <Picker.Item label="Tops" value="tops" />
              <Picker.Item label="Bottoms" value="bottoms" />
              <Picker.Item label="One-Pieces" value="one-pieces" />
            </Picker>
          </View>
        </View>

        {/* Try On Button */}
        <TouchableOpacity
          style={[
            styles.tryOnButton,
            (loading ||
              (!modelImage && !modelImageUrl) ||
              (!garmentImage && !garmentImageUrl)) &&
              styles.disabledButton,
          ]}
          onPress={processTryOn}
          disabled={
            loading ||
            (!modelImage && !modelImageUrl) ||
            (!garmentImage && !garmentImageUrl)
          }
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.tryOnButtonText}>Try On</Text>
          )}
        </TouchableOpacity>

        {/* Reset Button */}
        <TouchableOpacity style={styles.resetButton} onPress={resetAll}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>

        {/* Results Section */}
        {result && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Result</Text>
            <Image source={{ uri: result }} style={styles.resultImage} />
            <TouchableOpacity style={styles.saveButton} onPress={saveImage}>
              <Text style={styles.saveButtonText}>Save to Gallery</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default function Page() {
  const { user } = useUser();

  return (
    <View style={styles.mainContainer}>
      <SignedIn>
        <VirtualTryOnApp />
      </SignedIn>
      <SignedOut>
        <View style={styles.authContainer}>
          <Text style={styles.authTitle}>FASHN Virtual Try-On</Text>
          <Text style={styles.authSubtitle}>
            Sign in to start trying on clothes virtually
          </Text>
          <View style={styles.authButtons}>
            <Link href="/(auth)/sign-in" style={styles.authLink}>
              <Text style={styles.authLinkText}>Sign In</Text>
            </Link>
            <Link href="/(auth)/sign-up" style={styles.authLink}>
              <Text style={styles.authLinkText}>Sign Up</Text>
            </Link>
          </View>
        </View>
      </SignedOut>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  credits: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  uploadContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    flex: 0.48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "dashed",
  },
  uploadButtonText: {
    color: "#333",
    fontWeight: "500",
  },
  imagePreviewContainer: {
    position: "relative",
    marginBottom: 10,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    resizeMode: "cover",
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 25,
    height: 25,
    borderRadius: 12.5,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  orText: {
    textAlign: "center",
    marginVertical: 10,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  tryOnButton: {
    backgroundColor: "#4D8EFA",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  tryOnButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#a7c6fd",
  },
  resetButton: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  resetButtonText: {
    color: "#333",
    fontSize: 16,
  },
  resultSection: {
    marginTop: 20,
  },
  resultImage: {
    width: "100%",
    height: 400,
    borderRadius: 8,
    resizeMode: "contain",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  // Authentication styles
  authContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  authTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  authSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  authButtons: {
    width: "100%",
    maxWidth: 300,
  },
  authLink: {
    backgroundColor: "#4D8EFA",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
  },
  authLinkText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
