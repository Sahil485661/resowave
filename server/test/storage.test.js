const assert = require("assert");
const path = require("path");

async function runTests() {
    console.log("=== Starting Gravitas Automated Storage Service Tests ===");

    // Test 1: Module import and interface compatibility
    console.log("Test 1: Verifying export contracts and backward compatibility...");
    const storageDefault = require("../src/service/storage.service");
    const { uploadFile, deleteFile, getClient } = require("../src/service/storage.service");

    assert.strictEqual(typeof storageDefault, "function", "Default export should be a callable function");
    assert.strictEqual(typeof uploadFile, "function", "Destructured uploadFile should be a function");
    assert.strictEqual(typeof deleteFile, "function", "Destructured deleteFile should be a function");
    assert.strictEqual(storageDefault, uploadFile, "storageDefault and uploadFile should be identical reference");
    console.log("✓ Test 1 Passed: Both default and destructured imports are fully compatible.");

    // Test 2: Client prototype and delete method contract
    console.log("Test 2: Verifying ImageKit client methods...");
    const client = getClient();
    assert.ok(client.files, "client.files should exist");
    assert.strictEqual(typeof client.files.upload, "function", "client.files.upload should be a function");
    assert.strictEqual(typeof client.files.delete, "function", "client.files.delete should be a function");
    assert.strictEqual(client.files.deleteFile, undefined, "client.files.deleteFile must NOT exist on ImageKit v7");
    console.log("✓ Test 2 Passed: client.files.delete exists and client.files.deleteFile correctly confirmed absent in SDK v7.");

    // Test 3: Null safety for deleteFile
    console.log("Test 3: Testing null/empty parameter handling in deleteFile...");
    const emptyResult = await deleteFile(null);
    assert.strictEqual(emptyResult, null, "deleteFile(null) should return null without throwing");
    const undefinedResult = await deleteFile(undefined);
    assert.strictEqual(undefinedResult, null, "deleteFile(undefined) should return null without throwing");
    console.log("✓ Test 3 Passed: deleteFile handles missing IDs safely.");

    // Test 4: Live ImageKit upload and delete round-trip
    console.log("Test 4: Performing end-to-end ImageKit upload and delete verification...");
    const testPayload = Buffer.from("ID3v2 test audio mock buffer for Gravitas verification");
    const testFileName = "gravitas-test-audio.mp3";

    const uploadRes = await uploadFile(testPayload, testFileName);
    assert.ok(uploadRes, "Upload response must be defined");
    assert.ok(uploadRes.fileId, "Upload response must have fileId");
    assert.ok(uploadRes.url, "Upload response must have url");
    assert.ok(uploadRes.url.includes("ik.imagekit.io"), "Upload URL should point to ImageKit endpoint");
    console.log(`  Uploaded test asset: ID=${uploadRes.fileId}, URL=${uploadRes.url}`);

    console.log("  Deleting test asset from ImageKit...");
    await deleteFile(uploadRes.fileId);
    console.log("✓ Test 4 Passed: Live ImageKit upload & cleanup cycle completed successfully.");

    // Test 5: Verify music controller imports and route wiring
    console.log("Test 5: Verifying music controller and routes wiring...");
    const musicController = require("../src/controller/music.controller");
    assert.strictEqual(typeof musicController.createMusic, "function", "createMusic must be a function");
    assert.strictEqual(typeof musicController.deleteMusic, "function", "deleteMusic must be a function");
    assert.strictEqual(typeof musicController.getAlbumsById, "function", "getAlbumsById must be a function");
    assert.strictEqual(typeof musicController.createAlbum, "function", "createAlbum must be a function");

    // Test 6: Verify app routes load without error
    console.log("Test 6: Verifying Express application wiring...");
    const app = require("../src/app");
    assert.ok(app, "Express app should load without throwing");
    console.log("✓ Test 6 Passed: Express app and all route handlers loaded cleanly.");

    console.log("\n=======================================================");
    console.log("ALL 6 TESTS PASSED: Gravitas Verification Succeeded!");
    console.log("=======================================================");
}

runTests().catch((err) => {
    console.error("Test execution failed:", err);
    process.exit(1);
});
